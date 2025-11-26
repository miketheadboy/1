export var BodyPart;
(function (BodyPart) {
    BodyPart["Head"] = "Head";
    BodyPart["Torso"] = "Torso";
    BodyPart["LeftArm"] = "Left Arm";
    BodyPart["RightArm"] = "Right Arm";
    BodyPart["LeftLeg"] = "Left Leg";
    BodyPart["RightLeg"] = "Right Leg";
})(BodyPart || (BodyPart = {}));
export var WoundSeverity;
(function (WoundSeverity) {
    WoundSeverity[WoundSeverity["Minor"] = 1] = "Minor";
    WoundSeverity[WoundSeverity["Moderate"] = 2] = "Moderate";
    WoundSeverity[WoundSeverity["Severe"] = 3] = "Severe";
    WoundSeverity[WoundSeverity["Critical"] = 4] = "Critical";
})(WoundSeverity || (WoundSeverity = {}));
export var WoundType;
(function (WoundType) {
    WoundType["Bruise"] = "Bruise";
    WoundType["Cut"] = "Cut";
    WoundType["Gunshot"] = "Gunshot";
    WoundType["Fracture"] = "Fracture";
    WoundType["Burn"] = "Burn";
    WoundType["Infection"] = "Infection";
})(WoundType || (WoundType = {}));
