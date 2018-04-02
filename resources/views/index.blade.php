@extends('layouts.app')

@section('content')
    <div class="logo">
        <span class="logo-text">{{ config('app.name') }}</span>
    </div>
    <div class="container">
        <h3>{{ __('common.hello', ['name' => Auth::user()->name ?? 'guest']) }}!</h3>

        @guest
            <a href="{{ route('login') }}">{{ __('Login') }}</a>
            <br>
            <a href="{{ route('register') }}">{{ __('Register') }}</a>
        @else
            <a href="{{ route('game') }}">Game</a>
            @if ( \Auth::user()->isAdmin())
                <br>
                <a href="{{ route('admin-index') }}">admin</a>
            @endif

            <br>

            <form id="logout-form" action="{{ route('logout') }}" method="POST">
                @csrf
                <input type="submit" value="{{ __('Logout') }}" class="btn btn-primary">
            </form>
        @endguest
    </div>
@endsection
