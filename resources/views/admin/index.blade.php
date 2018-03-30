@extends('layouts.app')

@section('content')
    <div class="container">
        {{ __('common.hello', ['name' => Auth::user()->name ]) }}!
    </div>
@endsection
