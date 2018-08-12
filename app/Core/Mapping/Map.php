<?php

namespace App\Core\Mapping;


class Map implements \JsonSerializable
{
    /**
     * @var Chunk[]
     */
    //protected $_chunks;


    protected $version;
    protected $width;
    protected $height;
    protected $data;

    /**
     * Map constructor
     *
     * @param string $version
     * @param int $width
     * @param int $height
     * @param array $data
     */
    public function __construct(string $version, int $width, int $height, array $data)
    {
        $this->version = $version;
        $this->width   = $width;
        $this->height  = $height;
        $this->data    = $data;
    }

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize(): array
    {
        return [
            'version' => $this->version,

            'width'  => $this->width,
            'height' => $this->height,

            'data' => $this->data,
        ];
    }
}
