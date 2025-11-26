import { BodyPart, WoundSeverity, WoundType } from './WoundTypes';
export class WoundManager {
    bodyParts;
    constructor() {
        this.bodyParts = this.initializeBodyParts();
    }
    initializeBodyParts() {
        const parts = {};
        Object.values(BodyPart).forEach(part => {
            parts[part] = {
                part,
                health: 100,
                maxHealth: 100,
                isCrippled: false,
                wounds: []
            };
        });
        return parts;
    }
    getState() {
        return {
            bodyParts: this.bodyParts
        };
    }
    setState(state) {
        if (state.bodyParts) {
            this.bodyParts = state.bodyParts;
        }
    }
    inflictWound(type, severity, bodyPart) {
        // If no body part specified, pick random weighted by size/hit chance
        const targetPart = bodyPart || this.getRandomBodyPart();
        const wound = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            severity,
            bodyPart: targetPart,
            isTreated: false,
            isInfected: false,
            painLevel: severity * 2,
            bleedRate: this.calculateBleedRate(type, severity),
            dayAcquired: 0 // Needs game date context, passed in update?
        };
        this.bodyParts[targetPart].wounds.push(wound);
        this.bodyParts[targetPart].health -= severity * 10;
        if (this.bodyParts[targetPart].health <= 0) {
            this.bodyParts[targetPart].health = 0;
            this.bodyParts[targetPart].isCrippled = true;
        }
        return wound;
    }
    treatWound(woundId, itemType) {
        for (const part of Object.values(this.bodyParts)) {
            const wound = part.wounds.find(w => w.id === woundId);
            if (wound) {
                if (wound.isTreated)
                    return { success: false, message: "Already treated." };
                // Logic for item effectiveness
                let effectiveness = 0;
                if (itemType === 'bandage' && (wound.type === WoundType.Cut || wound.type === WoundType.Gunshot)) {
                    effectiveness = 0.8;
                }
                else if (itemType === 'whiskey' && wound.type === WoundType.Infection) {
                    effectiveness = 0.5;
                }
                else if (itemType === 'splint' && wound.type === WoundType.Fracture) {
                    effectiveness = 0.9;
                }
                if (Math.random() < effectiveness) {
                    wound.isTreated = true;
                    wound.bleedRate = 0;
                    return { success: true, message: "Wound treated successfully." };
                }
                else {
                    return { success: false, message: "Treatment failed." };
                }
            }
        }
        return { success: false, message: "Wound not found." };
    }
    update(daysPassed, playerManager) {
        let totalBleedDamage = 0;
        let totalPain = 0;
        Object.values(this.bodyParts).forEach(part => {
            part.wounds.forEach(wound => {
                // Bleeding
                if (!wound.isTreated && wound.bleedRate > 0) {
                    totalBleedDamage += wound.bleedRate * daysPassed;
                }
                // Infection risk
                if (!wound.isTreated && !wound.isInfected && wound.type !== WoundType.Bruise) {
                    if (Math.random() < 0.1 * daysPassed) {
                        wound.isInfected = true;
                        wound.painLevel += 2;
                        // Notify infection?
                    }
                }
                // Natural Healing
                if (wound.isTreated || wound.severity === WoundSeverity.Minor) {
                    // Chance to heal/remove wound
                    if (Math.random() < 0.2 * daysPassed) {
                        // Heal logic... remove wound or reduce severity
                    }
                }
                totalPain += wound.painLevel;
            });
        });
        if (totalBleedDamage > 0) {
            playerManager.modifyStat('health', -totalBleedDamage);
        }
        if (totalPain > 0) {
            playerManager.modifyStat('morale', -Math.floor(totalPain / 5));
        }
    }
    getRandomBodyPart() {
        const parts = Object.values(BodyPart);
        // Simple random for now, could weight Torso higher
        return parts[Math.floor(Math.random() * parts.length)];
    }
    calculateBleedRate(type, severity) {
        if (type === WoundType.Bruise || type === WoundType.Fracture)
            return 0;
        return severity * 2; // e.g., Gunshot (3) * 2 = 6 HP/day
    }
}
