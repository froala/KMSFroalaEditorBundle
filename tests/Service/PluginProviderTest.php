<?php

declare(strict_types=1);

namespace KMS\FroalaEditorBundle\Tests\Service;

use KMS\FroalaEditorBundle\Service\PluginProvider;
use PHPUnit\Framework\TestCase;

final class PluginProviderTest extends TestCase
{
    /**
     * @var PluginProvider
     */
    private $provider;

    protected function setUp(): void
    {
        $this->provider = new PluginProvider();
    }

    public function testObtainArrPluginCamelized(): void
    {
        static::assertSame(['paragraphFormat'], $this->provider->obtainArrPluginCamelized(['paragraph_format']));
    }
}
