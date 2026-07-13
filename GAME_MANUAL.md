# Risk Variant Instruction Manual

## Objective

Win by being the last player remaining on the board. A player is eliminated when they have no owned countries or no troops remaining in owned countries. Troops in shared staging territories do not prevent elimination, but they may be redistributed under the shared staging rules.

## Key Terms

- **Country:** A playable territory on the board, except shared staging territories.
- **Magnitude:** A country's value. Magnitude affects claiming requirements, recruits, and nuclear retaliation.
- **Region:** A group of countries. Owning every country in a region gives a recruit bonus at the beginning of each later round.
- **Network:** A group of related countries that are treated as connected for troop transfers if owned by the same player.
- **Land border:** A normal border between countries.
- **Maritime border:** A sea connection. It works like a border, but attacks across it are limited to 2 attack dice.
- **Limited regional attack:** An attack against a country in the same region even when there is no actual border. It is limited to 1 attack die and gives limited information.

## Setup

1. Choose the number of players.
2. Enter player names.
3. Player order is alphabetical.
4. Each player is randomly assigned 1 starting country.
5. Each player starts with 10 troops in that country.
6. Round 1 begins immediately with action turns. There are no recruits or transfers before the first round.

## Turn Order

Turns follow alphabetical snake order.

Example with players A, B, C, and D:

```text
A, B, C, D, D, C, B, A, A, B, C, D...
```

The players at both ends of the snake take two consecutive turns when the order reverses.

Round endings do not reset or change turn order. If a round ends after a player's turn, the next turn still goes to whoever would have acted next in the snake order.

When the turn changes to the next player, the player map automatically resets and centers on the new player's country with the most troops. If more than one country is tied, it centers on the tied country that player has held the longest.

## Rounds

A round is not the same as every player taking one turn. After each player's turn, there is a chance that the round ends.

The chance of the round ending after a turn is:

```text
1 / number of active players remaining
```

Example: If 4 players remain, the round ends on a 1-in-4 roll.

If every active player passes on consecutive turns in the same round, meaning no attacks, claims, or transfers are made, the round automatically ends on the next turn. The snake order still continues normally.

## Beginning of a Round

At the beginning of each new round, recruits are calculated automatically.

If no player receives recruits, the recruit placement screen is skipped and turns begin immediately.

If any player receives recruits, all players with recruits submit recruit plans independently. Recruits are not added to the board immediately. Once every active player with recruits has submitted a plan, all recruit placements resolve together and action turns begin.

## Recruits

Each player receives recruits based on the total magnitude of the countries they own.

```text
base recruits = floor((sum of owned country magnitudes / 25) + carried fraction)
```

Any fractional remainder carries over to that player's next round.

Example:

```text
Owned magnitude total: 61
61 / 25 = 2.44
Player receives 2 recruits
0.44 carries over
```

Region bonuses are added after base recruits.

### Nuclear Recruit Penalties

Region bonus recruits can be withheld only by starting nuclear-country penalties.

If a player starts the game on a nuclear country, they receive a penalty equal to that country's magnitude. The first region bonus recruits they would receive are withheld until the penalty is fully paid.

Example: A player starts on a magnitude 9 nuclear country. Across future rounds, the first 9 region bonus recruits they earn are withheld. If they earn 4 region bonus recruits in one round and 6 in a later round, they receive 0 from the first bonus, 1 from the second bonus, and the penalty is then complete.

If nuclear retaliation removes fewer troops than the nuclear country's magnitude, the unused retaliation amount expires. It does not become a future recruit penalty, whether the retaliating country is owned or unowned, and whether the defending player stops early or simply has no remaining legal targets.

Nuclear recruit penalties only withhold region bonus recruits. They do not reduce magnitude-based recruits.

## Region Bonuses

If a player controls every country in a region at the beginning of a round, they receive that region's bonus.

| Region | Bonus |
|---|---:|
| Eastern Europe | 11 |
| Northern Africa | 10 |
| Northern Middle East | 7 |
| East Asia | 6 |
| Central Africa | 6 |
| Southern Europe | 5 |
| Southeastern Africa | 5 |
| Southern Middle East | 5 |
| Western Europe | 4 |
| South America | 4 |
| Northern Europe | 4 |
| Western Africa | 3 |
| Southern Caribbean | 3 |
| Central Asia | 3 |
| North America | 3 |
| Southeast Asia | 3 |
| Northern Caribbean | 2 |
| Southern Africa | 2 |
| Western Oceania | 2 |
| Eastern Oceania | 1 |

When a player gains control of every country in a region, the game log announces it.

## Recruit Placement

Recruits may be placed in countries owned by that player.

Recruits may also be placed in a shared staging territory if the player owns at least one country eligible to transfer to or from that territory.

All recruits must be assigned before a player can submit their plan.

In the app:

1. During the Place Recruits phase, click one of your owned countries on the map or use the Place Recruits form.
2. Add recruits to your plan.
3. Continue until your plan assigns all recruits available to you.
4. Click **Submit Recruit Plan**.
5. Wait for the other active players to submit.

Recruits appear on the board only after every active player with recruits has submitted a plan. This lets players plan at the same time without overwriting each other's placements.

## Player Visibility

Players do not see the full board during their own turns.

Players can fully see:

- Their own countries.
- Countries bordering their own countries by land or maritime border.
- Countries connected by network to their own countries.
- Shared staging territories they can access.

For fully visible countries, players can see:

- Country name.
- Owner, if any.
- Region.
- Network, if any.
- Magnitude.
- Troop count if the country is owned by that player or another player.

If a fully visible country is unowned, troop count is assumed to be 0 and does not need to be shown on the map.

Players can partially see:

- Countries in the same region as one of their countries, if those countries are not otherwise visible.

For partially visible countries, players see only the country name and region.

Countries that are not owned, bordering, network-connected, shared-staging-visible, or in the same region are hidden from that player.

The entire world map becomes visible to a player if they own United States, China, Russia, India, or Japan. The entire world map also becomes visible if they own Germany, Italy, and Czechia at the same time.

Country labels use slightly different font styles by region. These styles are only applied to countries already visible to the player and do not reveal hidden countries.

## Actions on a Turn

On a turn, a player may do any number of the following:

- Attack enemy countries.
- Claim unowned countries.
- Make end-of-turn transfers.

A player may attack or claim as many times as they want during a single turn, as long as each action is legal.

At least 1 troop must always remain behind in the origin country when attacking, claiming, or transferring.

The player map remains clickable even when it is not your turn, but action controls only appear when you are allowed to act.

## Claiming Unowned Countries

A player may claim an unowned country that has an actual land or maritime border with one of their owned countries.

To claim a country, the player must move troops into it.

Minimum troops required:

```text
max(1, target country magnitude)
```

Magnitude 0 countries still require at least 1 troop to claim.

The origin country must still have at least 1 troop after the claim.

## Attacking Owned Countries

Attacks use Risk-style dice.

The attacker may roll:

- Up to 3 dice for normal land attacks.
- Up to 2 dice for maritime attacks.
- Up to 1 die for limited regional attacks.

Each player has a capital country: the country that player has held the longest among the countries they currently own. If a player loses their capital, their next longest-held country becomes their capital.

A capital country does not change whether an attack is legal. The origin country must still have enough movable troops to attack, and the normal kept-dice limits still apply.

When a capital attacks or defends, it rolls 1 extra die, then removes its lowest die before dice are compared. This improves the capital's selection of dice without increasing the maximum number of troops that can be lost in that combat.

The defender normally keeps up to 2 dice, limited by the number of troops in the defending country. A defending capital rolls 1 extra die and drops the lowest before comparison.

Dice are sorted from highest to lowest and compared in order.

- If the attack die is higher, the defender loses 1 troop.
- If the dice are tied or the defense die is higher, the attacker loses 1 troop.

Ties go to the defender.

## Conquest

If an attack reduces the defender's country to 0 troops, the attacker conquers it.

The attacker must move at least 1 troop into the conquered country, while still leaving at least 1 troop behind in the origin country.

If the conquered country is a nuclear power, nuclear retaliation may occur after the conquest is completed.

## Limited Regional Attacks

A player may attack a country in the same region even if it does not share an actual border.

Limited regional attacks use only 1 attack die.

If the target country has limited information, the attacker may only learn certain outcomes:

- If one of the attacker's troops dies, they are told that.
- If the target is unowned and the player committed enough troops to claim it, they are told that they found and claimed it.
- If the target is owned and the attack kills its final troop, they are told that they conquered it.
- Otherwise, they are told no visible result.

If the player tries to claim a limited-information unowned country without committing enough troops, they are told only that the move is not high enough. The required number is not revealed.

## Transfers

Transfers happen at the end of a player's turn, after they are finished attacking and claiming.

Transfers are resolved immediately when submitted.

Troops may be transferred between two places if there is a continuous path through countries owned by that player using:

- Land borders.
- Maritime borders.
- Network connections.

The origin must keep at least 1 troop, unless the origin is a shared staging territory.

Players cannot transfer between countries merely because they are in the same region. There must be an actual land, maritime, or network path through owned countries.

## Networks

Countries in the same network are treated as connected for transfers if they are owned by the same player.

Countries in the same network do not count as borders for ordinary attacks.

A country in the same network may only be attacked if it is also in the same region and is therefore eligible for a regional attack.

## Shared Staging Territories

Antarctica and Bir Tawil are special non-ownable territories.

Shared staging territories:

- Cannot be owned.
- Cannot be attacked.
- Has no magnitude.
- Has no region.
- Can hold troops from multiple players at the same time.
- Is not part of nuclear retaliation target order.

A player may transfer troops to or from a shared staging territory if they own at least one eligible country for that territory.

Eligible Antarctica countries are:

Argentina, Australia, Brazil, Chile, China, Czechia, France, Germany, India, Italy, Japan, New Zealand, Norway, Poland, Russia, South Africa, South Korea, Ukraine, United Kingdom, United States, and Uruguay.

Eligible Bir Tawil countries are:

The Sudan and Egypt.

If a player loses all owned countries but has troops in a shared staging territory, those troops become available to the player with the most troops in that same shared staging territory.

If multiple players are tied for the most troops in that staging territory, the leftover troops remain unclaimed until the tie is broken.

## Nuclear Powers

The following countries are always nuclear powers:

- United States
- China
- North Korea
- Pakistan
- India
- Israel
- United Kingdom
- France
- Russia

The following countries are conditional nuclear powers:

- Belarus, if owned by the same player as Russia.
- Germany, if owned by the same player as United States.
- Turkey, if owned by the same player as United States.
- Italy, if owned by the same player as United States.
- Belgium, if owned by the same player as United States.
- Netherlands, if owned by the same player as United States.

Conditional nuclear status is checked based on who owns the country at the moment it is attacked or claimed. For example, unowned Belarus is not nuclear just because the player claiming it already owns Russia.

## Nuclear Retaliation

If a player attacks, conquers, or claims a nuclear power, that nuclear power may retaliate after the attack or claim is completed.

The retaliation removes troops equal to the nuclear country's magnitude.

If the nuclear country was conquered or claimed, its own newly placed troops are not eligible targets for its retaliation.

If the initial target was unowned, it retaliates automatically once. No counter-retaliation chain happens. Its automatic targets are limited to countries it could strike under the nuclear targeting rules below.

If the initial target was owned by another player, that owner chooses whether to use nuclear retaliation. If they do, they choose retaliation targets one at a time until the required number of troops has been removed or there are no legal targets left. Retaliation can create a chain.

If a player loses their last country and that country was nuclear, they may still choose nuclear retaliation from that country.

## Nuclear Retaliation Targets

For most nuclear countries, retaliation targets are limited to opponent countries that are normally in attack range of the retaliating country:

- Countries sharing a land border.
- Countries sharing a maritime border.
- Countries in the same region.

United States, Russia, China, United Kingdom, France, India, Israel, and North Korea are strategic nuclear retaliators. If one of those countries retaliates while owned by a player, it may target any opponent country visible to that player. If an unowned strategic nuclear country retaliates, it is treated as its own one-country player for visibility.

For automatic unowned nuclear retaliation, legal targets are chosen in this order:

1. Land-border targets.
2. Maritime-border targets.
3. Same-region targets.
4. Non-nuclear before nuclear.
5. Highest magnitude.
6. Fewest troops.
7. Longest held.

If a country is reduced to 0 troops by nuclear retaliation, that player loses the country.

If the full retaliation amount has not yet been paid, losses continue to the next country in the order.

If the full retaliation amount has not been paid and the retaliating player stops or has no legal targets left, the unused retaliation amount expires. It does not become a future region bonus recruit penalty.

## Nuclear Counter-Retaliation

If a nuclear retaliation against an attacking player removes troops from one of that attacker's nuclear countries, the attacker may choose to counter-retaliate against the defender.

Counter-retaliation follows the same rules as nuclear retaliation. The eligible player may decline, or may choose legal target countries one at a time until the required number of troops has been removed, no legal targets remain, or they stop early.

If a player's nuclear country was hit by retaliation, they may counter-retaliate even if that retaliation caused them to lose the nuclear country.

Retaliation and counter-retaliation target options are captured at the moment the relevant nuclear country is hit. If that nuclear country later loses all troops, its queued retaliation still uses the visibility and target list it had when it was hit. If several nuclear countries are hit in order, each one captures its own target list at the moment it is hit.

If a counter-retaliation hits one of the opponent's nuclear countries, that opponent gets the same choice to counter-retaliate under the same targeting rules.

The chain continues as long as eligible nuclear countries are hit and eligible players choose to keep retaliating.

## Elimination

A player is eliminated if they have:

- No owned countries, or
- No troops in owned countries.

These conditions are treated together: a player with no countries cannot continue receiving recruits, and a player with no troops in owned countries cannot remain active.

If only one active player remains, the game ends immediately and that player wins.

Eliminating another player does not automatically end the current player's turn. The player who made the elimination may keep attacking, claiming, or transferring unless the elimination leaves only one active player and ends the game.

## Forfeiting

A player may forfeit from the game controls.

When a player forfeits:

- All of their troops outside shared staging territories are removed.
- All countries they owned become unowned.
- They stop receiving recruits and are no longer active.
- Their troops in shared staging territories remain there.

If the forfeiting player was taking a turn, the snake order advances cleanly to the next active player. If only one active player remains after the forfeit, that player wins.

## Online and Hidden Information Notes

The app tracks hidden information, dice rolls, recruit carryover, region control, shared staging troops, nuclear retaliation chains, forfeit state, simultaneous recruit plans, and turn order.

The game is designed for hostless online play. Players enter the shared Game ID and their exact player name to access their own view.

The player map shows only what the current player is allowed to know.

The player map automatically resets for the next player at the end of each turn.

The log is filtered by visibility. Players see only the actions and events they are allowed to know. Private events such as hidden attacks, recruit details, region control changes, and eliminations are not automatically public to every player.

When the game ends, the full-information map can show an endgame timeline. The timeline can be scrubbed with a slider to see the world map at initial setup, after completed turns, and at the final game state.
