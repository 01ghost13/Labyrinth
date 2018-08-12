<?php

namespace App\Http\Controllers;

use App\Core\Mapping\MapManager;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function get(Request $request)
    {
        $request->validate([
            'name' => 'required|alpha_dash'
        ]);


        try
        {
            $map = MapManager::load($request->name);
        }
        catch (\Exception $e)
        {
            return response()->json(['error' => $e->getMessage()]);
        }


        return response()->json($map);
    }

    public function set(Request $request)
    {
        $request->validate([
            'name'    => 'required|alpha_dash',
            'width'   => 'required|integer|between:5,100',
            'height'  => 'required|integer|between:5,100',
            'data'    => 'array',
        ]);


        try
        {
            $data = $request->data;

            if (!$data)
            {
                foreach (\range(0, ($request->width * $request->height - 1)) as $i)
                {
                    $data[$i] = \rand(1, 2);
                }
            }

            if ($request->width * $request->height != \count($data))
            {
                throw new \Exception('Wrong map data');
            }


            MapManager::create($request->name, [
                'version' => 1,
                'width'   => $request->width,
                'height'  => $request->height,
                'data'    => $data,
            ]);
        }
        catch (\Exception $e)
        {
            return response()->json(['error' => $e->getMessage()]);
        }


        return response('');
    }
}
