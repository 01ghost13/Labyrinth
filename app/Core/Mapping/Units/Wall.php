<?php

namespace App\Core\Mapping\Units;


use App\Core\Mapping\Unit;
use App\Core\Mapping\UnitMaker;
use App\Core\Mapping\UnitStyles;


class Wall extends Unit
{
    public function __construct(array $params = [])
    {
        $this->_style        = $params['style']        ?? UnitStyles::default;
        $this->_visible      = $params['visible']      ?? true;
        $this->_breakable    = $params['breakable']    ?? false;
        $this->_transparency = $params['transparency'] ?? false;
    }
}
