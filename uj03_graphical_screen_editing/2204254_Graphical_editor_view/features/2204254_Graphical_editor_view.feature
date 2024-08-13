Feature: uj03_graphical_screen_editing - 2204254_Graphical_editor_view
    As a configuration engineer (Igor / Anna), 
    I would like to have standardized and intuitive graphical editor,
    So that, my screen engineering is simplified.

    @tc:3629290
    @feature:2204254
    Scenario: Open screen file with screen editor
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And I run "git restore .\\test-workspaces\\", to restore the workspace
        And I sleep "5" seconds, to make sure
        And the workspace "uj03_graphical_screen_editing_ws" is opened
        And no webviews are open
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        Then "1" webview is open 
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview should look like reference image "01_screen_editor_basic-Initial"

