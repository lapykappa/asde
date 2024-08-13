Feature: uj03_graphical_screen_editing - 2204307_Tag_dynamization_Simple_Tags
    As a Configuration engineer Anna,
    I want to have a possibilities for configuring the dynamics for the properties of my visual elements
    So that I can engineer them as desired.

    @tc:3630287
    @feature:2204307
    Scenario: Bind data (tags) to UI components: Dynamize Process Value with Tag
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And I run "git restore .\\test-workspaces\\", to restore the workspace
        And I sleep "5" seconds, to make sure
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        Then "1" webview is open
        When I open the bottombar
        And I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Properties" in the bottombar
        Then "2" webviews are open
        When I sleep "5" seconds, to make sure
        And I select "HmiBar_367" in the webview "Screen Editor | MyScreen"
        When I sleep "5" seconds, to make sure
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        When I dynamize "ProcessValue" with Tag "FillLevel"
        When I sleep "5" seconds, to make sure
        Then the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml" should contain "FillLevel"
        