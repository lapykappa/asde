import {commonConfig, makeCucumberOpts, makeCapabilitiesDesktop, makeServicesDesktop} from "./00_common_conf.js"

export const config = commonConfig

config.specs = ["./uj03_graphical_screen_editing/*/features/*.feature"]
config.capabilities = makeCapabilitiesDesktop("uj03_graphical_screen_editing_ws")
config.services = makeServicesDesktop("uj03_graphical_screen_editing/data/images","uj03_graphical_screen_editing/.tmp")
config.cucumberOpts = makeCucumberOpts("uj03_graphical_screen_editing")  