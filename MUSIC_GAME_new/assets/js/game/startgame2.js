function StartGame2()
{
    WINDOW.Initialize();
	GAME.Initialize( 'canvas-start', 1);
	DISPLAY.Resize( WINDOW.ms_Width, WINDOW.ms_Height );

	MainLoop();
}