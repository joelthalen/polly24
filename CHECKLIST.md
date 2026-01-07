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
  - [ ] validera att fältet inte tomt
  - [ ] trycka enter för att skicka
  - [ ] inte få välja samma användarnamn som nån annan

## lobby/Host settings skärm

- [ ] Waiting for opponent label/ name of opp
  - [ ] player joined game popup
- [X] Ready knapp
- [ ] Current players lista
 - [ ] Ready state of players
- [ ] Hoster settings
  - [ ] Turn-based/real-time (Optional)
  - [ ] Spelplan-storlek (optional)
- [X] Join code display
  - [ ] QR-kod knapp (Optional)
- [ ] Emojis och vibbar 😂

### Serverlogik

- [x] socket-kanal för varje separat spel
- [X] Skapa spel
- [ ] Flera spelare?

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
- [ ] **Win Condition**: Kolla om spelare har "4 i rad", ()
  - Kolla vid varje brick-uppdatering?
- [x] Reset bräde
- [ ] Draw/Forfiet (optional)
- [ ] Disconnect 

#### Trivia

- [ ] Läs in data-fil(er) med triviafrågor
  - Översättningar och kategorier
  - JSON eller CSV?
- [ ] Tilldela varje kolumn en fråga
  - [ ] Varje kolumn representerar en kategori? (Optional) 
- [ ] Skicka fråga och (4) svarsalternativ till rätt spelare
  - Ska alla kolumner populeras med Q/A direkt eller efter behov (när spelaren klickar på kolonn)?
- [ ] Ta emot svar från spelaren och avgör om svaret stämmer.
  - [ ] Rätt svar: Placera bricka 
  - [ ] Fel svar: lockdown lockout locked out.

## Vinnare/Förlorare skärm

- [ ] Visa vinnar/förlorar text i grönt/rött
- [ ] Inte blockera spelplan
- [ ] Visa vinnande marker
- [ ] Rematch knapp
- [ ] Leave game

## Frågekomponent

- [ ] Fråga
- [ ] Svarsalternativ
- [ ] Tillbakaknapp
- [ ] Temaenliga bakgrunder
- [ ] Bekräftelse
  - [ ] Grönt på rätt svar
  - [ ] Konfetti
  - [ ] Rött på fel svar

## 4 i rad komponent

- [x] Bricka för spelare 1 och 2
- [x] spel-matris

## Globala komponenter

- [ ] Language (alla texter ska referrera till language-dokument)
- [ ] Flagga för language
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