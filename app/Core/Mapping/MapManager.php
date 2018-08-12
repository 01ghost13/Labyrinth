<?php

namespace App\Core\Mapping;


/**
 * Class MapManager
 *
 * @package App\Core\Mapping
 */
class MapManager
{
    const MAP_EXTENSION = '.map';

    const UNITS_NAME_PREFIX = 'unit_';


    /**
     * Load map from storage
     *
     * @param string $name
     *
     * @return Map
     * @throws \Exception
     */
    public static function load(string $name): Map
    {
        $file = \Storage::disk('maps')->get($name . self::MAP_EXTENSION);

        $file_data = unpack('cversion/lwidth/lheight/c*' . self::UNITS_NAME_PREFIX, $file);

        $map_data = self::decodeMapData($file_data);


        return new Map($map_data['version'], $map_data['width'], $map_data['height'], $map_data['data']);
    }

    /**
     * Create map
     *
     * @param string $name
     * @param array $data
     *
     * @throws \Exception
     */
    public static function create(string $name, array $data)
    {
        if (!$data['version'] || !$data['width'] || !$data['height'] || !$data['data'])
        {
            throw new \Exception('Wrong data');
        }

        $packed = pack(
            'cllc*',
            ...array_merge([ $data['version'], $data['width'], $data['height'] ], $data['data'])
        );

        \Storage::disk('maps')->put($name . self::MAP_EXTENSION, $packed);
    }

    /**
     * Delete map
     *
     * @param string $name
     */
    public static function delete(string $name)
    {
        \Storage::disk('maps')->delete($name . self::MAP_EXTENSION);
    }

    /**
     * Decode map data
     *
     * @param array $file_data
     *
     * @return array
     */
    protected static function decodeMapData(array $file_data): array
    {
        $result = [
            'version' => (int)$file_data['version'] ?? 0,

            'width'  => (int)$file_data['width'] ?? 0,
            'height' => (int)$file_data['height'] ?? 0,

            'data' => []
        ];


        if ($result['width'] == 0 or $result['height'] == 0)
        {
            return $result;
        }


        foreach (range(0, $result['height'] - 1) as $j)
        {
            foreach (range(0, $result['width'] - 1) as $i)
            {
                $result['data'][$i][$j] = $file_data[self::UNITS_NAME_PREFIX . (1 + $i + $j * $result['width'])];
            }
        }


        return $result;
    }
}
