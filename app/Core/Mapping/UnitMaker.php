<?php

namespace App\Core\Mapping;


use App\Core\Mapping\Units\Wall;
use App\Core\Mapping\Units\WayPoint;


final class UnitMaker
{
    /**
     * @var array - available units
     */
    const types = [
        1 => Wall::class,
        2 => WayPoint::class,
    ];


    private function __construct() {}


    public static function make(string $class, int $num = 0, array $params = [])
    {
        $result = [];


        if (!\class_exists($class))
        {
            throw new \Exception('Class "' . $class . '" does not exist.');
        }
        elseif (!\is_subclass_of($class, Unit::class))
        {
            throw new \Exception('Class "' . $class . '" is not child of "Unit".');
        }


        foreach (\range($num <= 0 ? $num : 1, $num) as $i)
        {
            $result[] = new $class($params);
        }


        return (\count($result) == 1) ? $result[0] : $result;
    }
}
/*
$units = [
    'wall'     => UnitMaker::make(Wall::class),
    'wayPoint' => '',
];
*/
//TODO:
// 1) сделать создание в стиле
/*
$maker = new UnitMaker(Wall::class);

$maker->set('visible', 1)
    ->set('transparency', 0);

$units = $maker->create(10);

// так же

$maker->setParams(['visible', 'transparency'], [1, 0]);

$maker->setData($data)->setFiller(function ($class, $datum) { return $class($datum); })->make(Wall::class, 10);
*/
