export var CombatActionType;
(function (CombatActionType) {
    CombatActionType["Attack"] = "Attack";
    CombatActionType["Shoot"] = "Shoot";
    CombatActionType["Melee"] = "Melee";
    CombatActionType["Reload"] = "Reload";
    CombatActionType["Defend"] = "Defend";
    CombatActionType["Flee"] = "Flee";
    CombatActionType["Negotiate"] = "Negotiate";
})(CombatActionType || (CombatActionType = {}));
export var EffectTrigger;
(function (EffectTrigger) {
    EffectTrigger["OnAttack"] = "on_attack";
    EffectTrigger["OnHit"] = "on_hit";
    EffectTrigger["OnKill"] = "on_kill";
    EffectTrigger["OnNegotiate"] = "on_negotiate";
    EffectTrigger["Passive"] = "passive";
})(EffectTrigger || (EffectTrigger = {}));
