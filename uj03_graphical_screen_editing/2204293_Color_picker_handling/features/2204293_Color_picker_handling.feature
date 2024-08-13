Feature: uj03_graphical_screen_editing - 2204293_Color_picker_handling

    @tc:3630256
    @feature:2204293
    Scenario: Change properties of UI componets: Change Circle Color
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
        And I select "HmiCircle_315" in the webview "Screen Editor | MyScreen"
        Then "2" webviews are open
        When I dismis all notifications
        When I sleep "10" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "10" seconds, to make sure
        When I change "BackColor" to the color "#DF0707" in the bottombar
        When I sleep "5" seconds, to make sure
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-with-RedHmiCircle_315"  
        When I sleep "50" seconds, for debugging
        # Scenario: Runtime Verification:
        Given UE Code is up and running
        And I set the workspace to "uj03_graphical_screen_editing_ws"
        And I sleep "20" seconds, to wait for updates
        When I remove all runtime projects
        When I run "apax dm preparedownload sample-dev --projectname sample-prj", to set compile the programming
        Then the path "test-workspaces/uj03_graphical_screen_editing_ws/sample-prj/sample-dev/Configuration/RDF_full" exists
        When I run "apax dm download sample-dev --projectname sample-prj", to download the configuration to the runtime
        When I run "apax dm startruntime sample-dev --projectname sample-prj", to start the runtime
        Given UE Code is up and running
        Given the runtime is restarted
        And I set the workspace to "uj03_graphical_screen_editing_ws"
        And I sleep "10" seconds, to wait for updates
        Then I should see a "WSI:Circle" with id "HmiCircle_315" in the runtime
        Then the "WSI:Circle" with id "HmiCircle_315" should have color "rgba(223,7,7,1)"