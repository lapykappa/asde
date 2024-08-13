Feature: uj03_graphical_screen_editing - 2204289_Enum_property_handling
    As a Configuration engineer Anna,
    I want to have a standardized accessibility for setting properties which are expected to have predefined set of values
    So that I can set them easily, leaving no room for mistakes.
 
    @tc:3630243
    @feature:2204289
    Scenario: Change properties of UI componets: Change Screen Properties
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And I run "git restore .\\test-workspaces\\", to restore the workspace
        And I sleep "5" seconds, to make sure
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        Then "1" webview is open
        When I open the bottombar
        When I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Properties" in the bottombar
        Then "2" webviews are open
        When I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Items" in the bottombar
        When I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Properties: UE Properties" in the bottombar
        When I sleep "5" seconds, to make sure
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        When I change "BackFillPattern" to "Cross" in the bottombar
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-with-Cross-BackFillPattern"   
        When I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Items" in the bottombar
        When I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Properties: UE Properties" in the bottombar
        When I change "BackFillPattern" to "GradientBackwardDiagonalTricolor" in the bottombar
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-with-GradientBackwardDiagonalTricolor-BackFillPattern"  
        When I sleep "50" seconds, for debugging

    @tc:3630244
    @feature:2204289
    Scenario: Change properties of UI componets: Change Circle BackFillPattern
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
        When I dismis all notifications
        And I sleep "5" seconds, to make sure
        And I open the tab "UE Screen Properties" in the bottombar
        And I select "HmiCircle_315" in the webview "Screen Editor | MyScreen"
        Then "2" webviews are open
        When I sleep "5" seconds, to make sure
        When I change "BackFillPattern" to "Cross" in the bottombar
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-with-HmiCircle_315-with-Cross-BackFillPattern"  
        When I sleep "50" seconds, for debugging
        