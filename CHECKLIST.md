# Checklist and planning

## Hemskärm

- [x] Logga
- [x] Host knapp
- [x] join Code input
 - [ ] Validera så bara korrekta koder kan skrivas in. (Optional)
  - [ ] små blir stora bokstäver, siffror ok. inget annat.
  - [ ]4 "siffrig" kod.
- [x] Join Game knapp
  - [ ] Hantera då en lobby med kod inte finns. (På LobbyView?)
- [ ] Grafik

### Serverlogik 

- [x] Skapa en lobby
- [x] Gå med i en existerande lobby

## Username view (Optional)

_kan kanske ligga som en komponent på lobbyn_

- [X] Choose username
  - [X] Get default username from server and populate value
  - [X] Text inputfield
  - [X] knapp som skickar "updateProfile" event med nya namnet till backend
  - [x] trycka enter för att skicka
  - [x] inte få välja samma användarnamn som nån annan

## lobby/Host settings skärm

- [ ] Waiting for opponent label/ name of opp
  - [ ] player joined game popup
- [X] Ready knapp
- [ ] Current players lista
 - [X] Ready state of players
- [ ] Hoster settings
  - [ ] Turn-based/real-time (Optional)
  - [ ] Spelplan-storlek (optional)
- [X] Join code display
  - [ ] QR-kod knapp (Optional)
- [ ] Emojis och vibbar 😂
- [ ] kicka spelare som host
- [ ] bara starta när alla är redo
- [ ] man lämnar spelet när man stänger fönstret

### Serverlogik

- [x] socket-kanal för varje separat spel
- [X] Skapa spel
- [x] Flera spelare?

## Spelskärm

### Visuellt
- [X] Your turn/opp turn visare
- [x] 4 in rad display
 - [x] Koppla till datarepresentation av spelplan som fås från servern 
- [ ] Motståndare fick rätt eller fel visare
- [x] knappar för att "släppa" marker i kolonn
  - [x] light up :hover css
- [ ] Ge upp knapp
- [ ] Request draw knapp
- [ ] Timer (Optional)

### Spellogik på servern

#### 4 i rad

- [x] Skapa (host(a)) en lobby
- [x] Gå med i en skapad lobby
- [x] Ready state för alla anslutna spelare att starta spelet.
- [x] Datarepresentation av spelplan
  - matris med markörpositioner?
- [x] Hantera när spelare placerar ut en bricka.
- [x] Skicka uppdateringar av spelplanen till spelarna. 
- [X] **Win Condition**: Kolla om spelare har "4 i rad", ()
  - Kolla vid varje brick-uppdatering?
- [x] Reset bräde
- [ ] Draw/Forfiet (optional)
- [ ] Disconnect 

#### Trivia

- [x] Läs in data-fil(er) med triviafrågor
  - Översättningar och kategorier
  - JSON eller CSV?
- [x] Skicka fråga och (4) svarsalternativ till rätt spelare
  - Ska alla kolumner populeras med Q/A direkt eller efter behov (när spelaren klickar på kolonn)?
- [x] Ta emot svar från spelaren och avgör om svaret stämmer.
  - [x] Rätt svar: Placera bricka 
  - [x] Fel svar: lockdown lockout locked out.

## Vinnare/Förlorare skärm

- [ ] Visa vinnar/förlorar text i grönt/rött
- [ ] Inte blockera spelplan
- [ ] Visa vinnande marker
- [ ] Rematch knapp
- [ ] Leave game

## Frågekomponent

- [x] Fråga
- [x] Svarsalternativ
- [ ] Bekräftelse
  - [ ] Grönt på rätt svar
  - [ ] Konfetti
  - [ ] Rött på fel svar

## 4 i rad komponent

- [x] Bricka för spelare 1 och 2
- [x] spel-matris

## Globala komponenter

- [ ] Language (alla texter ska referrera till language-dokument)
- [X] Flagga för language
- [ ] Regler dialog box (Modal)
- [ ] Visa Regler knapp

## Serverlogik

- [ ] Frågelista data

## Ljudeffekter

## Accessability

- [ ] Colorblind friendly
- [ ] cirkel och kryss för marker

## DATA

- [ ] Frågor
- [ ] Översättningar

## Global CSS
- [ ] :button - hover, färgändring typ svart opacity 10%
- [ ] font?
- [ ] färgtema i variabler
- [ ] resizeable for mobil

## Customization?

- [x] Ändra spelplanstorlek
- [ ] min och max caps på spelplansstorlek
- [ ] Ändra win condition
- [ ] Ändra svårhetsgrad på frågor

## Fix i lobbyvyn

- [ ] Rubriker för högra rutan
  - [ ] Namn?  /  Name?
  - [ ] Roll? Spelare/Åskådare  /  Role: Player/Spectator
    - [ ] Ifall spectator: Låst från redocheck och färgval
  - [ ] Redo? Ja/Nej  /  Ready? Yes/No  (För hosten står det bara Host/Värd)
  - [ ] Spelarfärg  /  Player colour
    - [ ] Färgval 6st tillräckligt distinkta

## Sista fix
- [ ] Christoffer Lundh-frågan
- [ ] Amongus-bakgrunden
- [ ] Hantera när fler spelare joinar lobbyn (både logiskt och grafiskt)

## Checklista inför presentationen
- [ ] An overview of the assumptions that you have made, for instance about context and users.
- [ ] A quick look at your initial clickable prototype.
- [ ] Live demonstrations of your different views (creating and participating in game).
- [ ] A presentation of the results of the usability evaluation that you have conducted of your final product.