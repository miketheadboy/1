// ============================================================================
// WORLD STATE - Global and Regional Tracking
// ============================================================================
export var WeatherType;
(function (WeatherType) {
    WeatherType["Clear"] = "Clear";
    WeatherType["Rain"] = "Rain";
    WeatherType["Drought"] = "Drought";
    WeatherType["Flood"] = "Flood";
    WeatherType["Snow"] = "Snow";
    WeatherType["Storm"] = "Storm";
})(WeatherType || (WeatherType = {}));
export var SystemType;
(function (SystemType) {
    SystemType["Ecology"] = "Ecology";
    SystemType["Economy"] = "Economy";
    SystemType["Politics"] = "Politics";
    SystemType["Combat"] = "Combat";
    SystemType["Player"] = "Player";
    SystemType["Weather"] = "Weather";
})(SystemType || (SystemType = {}));
export var PlayerActionType;
(function (PlayerActionType) {
    PlayerActionType["Violence"] = "Violence";
    PlayerActionType["Trade"] = "Trade";
    PlayerActionType["Diplomacy"] = "Diplomacy";
    PlayerActionType["Crime"] = "Crime";
    PlayerActionType["Heroism"] = "Heroism";
    PlayerActionType["Build"] = "Build";
    PlayerActionType["Recruit"] = "Recruit";
})(PlayerActionType || (PlayerActionType = {}));
// ============================================================================
// NARRATIVE ARC SYSTEM
// ============================================================================
export var ArcType;
(function (ArcType) {
    ArcType["Short"] = "Short";
    ArcType["Medium"] = "Medium";
    ArcType["Long"] = "Long"; // 8+ events
})(ArcType || (ArcType = {}));
export var ConditionType;
(function (ConditionType) {
    ConditionType["Tension"] = "Tension";
    ConditionType["Resource"] = "Resource";
    ConditionType["Faction"] = "Faction";
    ConditionType["Weather"] = "Weather";
    ConditionType["PlayerReputation"] = "PlayerReputation";
    ConditionType["Population"] = "Population";
    ConditionType["Date"] = "Date";
})(ConditionType || (ConditionType = {}));
export var ComparisonOp;
(function (ComparisonOp) {
    ComparisonOp["GreaterThan"] = ">";
    ComparisonOp["LessThan"] = "<";
    ComparisonOp["Equal"] = "==";
    ComparisonOp["GreaterOrEqual"] = ">=";
    ComparisonOp["LessOrEqual"] = "<=";
})(ComparisonOp || (ComparisonOp = {}));
// ============================================================================
// NPC MEMORY SYSTEM
// ============================================================================
export var InteractionType;
(function (InteractionType) {
    InteractionType["Trade"] = "Trade";
    InteractionType["Combat"] = "Combat";
    InteractionType["Dialogue"] = "Dialogue";
    InteractionType["Gift"] = "Gift";
    InteractionType["Betrayal"] = "Betrayal";
    InteractionType["Rescue"] = "Rescue";
    InteractionType["Theft"] = "Theft";
})(InteractionType || (InteractionType = {}));
