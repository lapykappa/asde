Feature: uj03_graphical_screen_editing - 2248579_Movement
    As Anna
    I want to be able to graphically edit HMI screens  
    So that I can visually design the user interface without directly editing yml files 

    @tc:3629861
    @feature:2248579
    Scenario: Drag & drop UI components on screen
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And the workspace "uj03_graphical_screen_editing_ws" is opened
        And no webviews are open
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        Then "1" webview is open 
        When I sleep "5" seconds, to make sure
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview should look like reference image "01_screen_editor_basic-Initial" 
        When I move screen element "HmiButton_645" by "20,50"
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
        Then I should see a "WSI:Button" with id "HmiButton_645" in the runtime
        Then the "WSI:Button" with id "HmiButton_645" should have position "x=161, y=4" 
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure 
        Then the webview should look like reference image "01_screen_editor_basic-TestTargetMovedBy2050"
    # Scenario: Drag & drop UI components on screen
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And the workspace "uj03_graphical_screen_editing_ws" is opened
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview should look like reference image "01_screen_editor_basic-Initial"
        When I move screen element "HmiButton_645" by "-20,-50"
        Then the webview should look like reference image "01_screen_editor_basic-Initial-again"  
