# PowerShell script to wire storyteller into GameState.ts
$filePath = "g:\BLEEDINGKANSAS\src\core\GameState.ts"
$content = Get-Content $filePath -Raw

# 1. Add PlayerActionType to imports (line 28)
$content = $content -replace `
    "import { type WorldState, WeatherType } from './StorytellerTypes';", `
    "import { type WorldState, WeatherType, PlayerActionType } from './StorytellerTypes';"

# 2. Add storyteller update to advanceTime (after line 125)
$oldAdvanceTime = @"
            const newDate = new Date(state.currentDate);
            newDate.setDate(newDate.getDate() + days);

            // Check for historical events first
            const historicalEvent = state.eventManager.checkForEvents({ ...state, currentDate: newDate });

            // If no historical event, check for random event (30% chance)
            let eventToTrigger = historicalEvent;
"@

$newAdvanceTime = @"
            const newDate = new Date(state.currentDate);
            newDate.setDate(newDate.getDate() + days);

            // Update Storyteller Systems
            state.systemInterconnects.update(newDate);
            const narrativeEvent = state.storytellerEngine.update(
                state.systemInterconnects.getWorldState(),
                state
            );

            // Check for historical events first
            const historicalEvent = state.eventManager.checkForEvents({ ...state, currentDate: newDate });

            // Prioritize narrative events, then historical events
            let eventToTrigger = narrativeEvent || historicalEvent;
"@

$content = $content -replace [regex]::Escape($oldAdvanceTime), $newAdvanceTime

# 3. Add ecology interconnect to huntAnimal
$oldHuntAnimal = @"
            const result = state.animalManager.huntAnimal(animalId, state.playerManager, state.inventoryManager);
            state.addLog(result.message);
            if (result.result === 'combat' && result.animal) {
"@

$newHuntAnimal = @"
            const result = state.animalManager.huntAnimal(animalId, state.playerManager, state.inventoryManager);
            state.addLog(result.message);
            
            // Trigger ecology interconnect if animal killed
            if (result.result === 'success' && result.animal) {
                state.systemInterconnects.onEcologyChange(result.animal.type as AnimalType, -1);
            }
            
            if (result.result === 'combat' && result.animal) {
"@

$content = $content -replace [regex]::Escape($oldHuntAnimal), $newHuntAnimal

# Save the file
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "✅ Storyteller wiring complete!" -ForegroundColor Green
Write-Host "Changes made to GameState.ts:" -ForegroundColor Cyan
Write-Host "  1. Added PlayerActionType import" -ForegroundColor White
Write-Host "  2. Added storyteller update to advanceTime()" -ForegroundColor White
Write-Host "  3. Added ecology interconnect to huntAnimal()" -ForegroundColor White
