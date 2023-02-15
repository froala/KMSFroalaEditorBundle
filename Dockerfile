FROM php:7.4-apache

LABEL maintainer="rizwan@celestialsys.com"
ARG PackageName
ARG PackageVersion
ARG NexusUser
ARG NexusPassword
ARG GitUsr
ARG GitToken
ARG sdkGitURL
ARG sdkBranch

WORKDIR /var/www/html/
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


RUN apt-get update \
    && apt-get install -y git zip unzip zlib1g-dev libzip-dev wget \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install zip


COPY . .
RUN rm -f composer.lock
RUN chmod -R 777 /var/www/html/
RUN composer instal
RUN a2enmod rewrite
EXPOSE 80
RUN php bin/console froala:install

# get the desired  sdk branch
RUN git clone --branch=${sdkBranch} https://${GitUsr}:${GitToken}@${sdkGitURL} /tmp/symfonysdk \
    && /bin/cp -fr /tmp/symfonysdk/* /var/www/html/vendor/kms/froala-editor-bundle/ \
    && rm -rf /tmp/symfonysdk
    
RUN wget --no-check-certificate --user ${NexusUser}  --password ${NexusPassword} https://nexus.tools.froala-infra.com/repository/Froala-npm/${PackageName}/-/${PackageName}-${PackageVersion}.tgz
RUN tar -xvf ${PackageName}-${PackageVersion}.tgz

RUN cp -a package/. vendor/kms/froala-editor-bundle/src/Resources/public/froala_editor/
RUN rm -rf package/ ${PackageName}-${PackageVersion}.tgz


RUN bin/console assets:install --symlink public

ENV APACHE_DOCUMENT_ROOT /var/www/html/public/
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite
