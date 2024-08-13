Feature: uj03_graphical_screen_editing - 01_graphical_screen_editing
    As a Configuration engineer (Anna),
    I want to have standard instantiation possibilities for the creation of visual elements,
    So that Engineering of screen visualization is easy and intuitive. 

    @tc:3630202
    @feature:2204265
    Scenario: Layout UI componets on screen: Add Gauge by drag and drop
        Given UE Code is up and running
        And I sleep "10" seconds, to for things to stabilize
        And I run "git restore .\\test-workspaces\\", to restore the workspace
        And I sleep "5" seconds, to make sure
        When I open the file "sample-prj/sample-dev/Configuration/MyScreen.screen.hmi.yml"
        And I select "UE: Open in Screen Editor" from the context menue of "MyScreen.screen.hmi.yml"
        And I sleep "10" seconds, for the screen editor to come up
        Then "1" webview is open
        When I open the bottombar
        And I open the tab "UE Screen Items" in the bottombar
        Then "2" webviews are open
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-without-additonal-gauge"
        When I drag "Gauge" from the bottombar to "200,100"
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        # Dismissing Notifications twice is necessary, because new notifications are shown after the first dismiss
        When I dismis all notifications
        When I sleep "5" seconds, to make sure
        Then the webview "Screen Editor | MyScreen" should look like reference image "01_screen_editor_basic-with-additonal-gauge"
        # Runtime Verification
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
        Then I should see a "WSI:Bar" with id "HmiBar_367" in the runtime
        Then I should see a "WSI:Button" with id "HmiButton_645" in the runtime
        Then I should see a "WSI:CheckBoxGroup" with id "HmiCheckBoxGroup_232" in the runtime
        Then I should see a "WSI:Clock" with id "HmiClock_549" in the runtime
        Then I should see a "WSI:Gauge" with id "HmiGauge_592" in the runtime
        Then I should see a "WSI:Label" with id "HmiLabel_653" in the runtime
        Then I should see a "WSI:RadioButtonGroup" with id "HmiRadioButtonGroup_659" in the runtime
        Then I should see a "WSI:Slider" with id "HmiSlider_690" in the runtime
        Then I should see a "WSI:ToggleSwitch" with id "HmiToggleSwitch_889" in the runtime
        Then I should see a "WSI:Button" with id "HmiButton_713" in the runtime
        Then I should see a "WSI:Button" with id "HmiButton_833" in the runtime