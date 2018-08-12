<?php

namespace App\Core\Mapping;


abstract class Unit
{
    /**
     * @var int
     */
    protected $_style;

    /**
     * @var bool - visibility
     */
    protected $_visible;

    /**
     * @var bool - penetrability
     */
    protected $_transparency;

    /**
     * @var bool - destructibility
     */
    protected $_breakable;


    /**
     * Unit constructor
     *
     * @param array $params
     */
    public function __construct(array $params = [])
    {
        /* //todo: видимо для каждого потомка свои деф параметры
           // TODO: сделать параметры юнита в виде маски (UNIT_VISIBLE = 2, UNIT_BREAKABLE = 4)
        $this->_style        = $params['style']        ?? UnitStyles::default;
        $this->_visible      = $params['visible']      ?? false;
        $this->_breakable    = $params['breakable']    ?? false;
        $this->_transparency = $params['transparency'] ?? false;
        */
    }

    /*
    public function getType(): int // так работать не будет
    {
        return \array_search(self::class, UnitMaker::types);
    }*/
}
