# **Primo rilascio WSDA A.A. 2026-27** 

### **Realizzazione del front-end di una piattaforma di e-commerce** 

### **1. Obiettivo del progetto** 

Il progetto consiste nello sviluppo del front-end di una semplice piattaforma di e-commerce per la visualizzazione e la gestione di prodotti appartenenti a diverse categorie. 

L’applicazione dovrà consentire all’utente di: 

- selezionare una categoria di prodotti; 

- caricare dinamicamente i prodotti della categoria scelta tramite AJAX; 

- visualizzare le informazioni principali dei prodotti; 

- cercare prodotti mediante parole chiave; 

- ordinare i prodotti secondo diversi criteri; 

- visualizzare i dettagli completi di un prodotto; 

- simulare l’aggiunta di un prodotto al carrello; 

- consultare il contenuto del carrello in una seconda pagina; 

- modificare la quantità di un prodotto; 

- rimuovere un prodotto dal carrello. 

Il progetto riguarderà esclusivamente lo sviluppo del front-end. Non dovrà essere realizzato un vero backend: le operazioni di modifica del carrello dovranno soltanto simulare il comportamento futuro mediante messaggi alert(). 

### **2. Struttura generale dell’applicazione** 

L’applicazione dovrà essere costituita almeno dai seguenti elementi: 

progetto/ � ��� index.html ��� carrello.html � ��� css/ �   ��� style.css � ��� js/ �   ��� prodotti.js �   ��� carrello.js � ��� xml/ �   ��� elettronica.xml �   ��� libri.xml �   ��� abbigliamento.xml �   ��� carrello.xml � ��� immagini/ ��� ... 

### **3. Prima pagina: catalogo dei prodotti** 

La prima pagina, ad esempio index.html, dovrà rappresentare il catalogo dei prodotti. 

La pagina dovrà contenere almeno: 

1. un’intestazione; 

2. un menu o selettore per la scelta della categoria; 

3. una casella di ricerca; 

4. un controllo per l’ordinamento; 

5. un’area destinata alla visualizzazione dei prodotti; 

6. una finestra modale per i dettagli del prodotto; 

7. un collegamento alla pagina del carrello. 

#### **3.1 Intestazione della pagina** 

L’intestazione dovrà contenere: 

- il nome o il logo del negozio; 

- un titolo descrittivo; 

- un collegamento alla pagina del carrello; 

- eventualmente il numero degli articoli presenti nel carrello. 

Il collegamento al carrello dovrà condurre alla seconda pagina dell’applicazione, ad esempio: 

carrello.html 

#### **3.2 Selezione della categoria** 

L’utente dovrà poter scegliere una categoria di prodotti tramite un elemento HTML, ad esempio una lista a discesa. Ogni categoria dovrà corrispondere a un diverso file XML. 

##### **Categoria File XML** 

Elettronica elettronica.xml Libri libri.xml 

Abbigliamento abbigliamento.xml 

Quando l’utente seleziona una categoria, l’applicazione dovrà: 

1. rilevare l’evento di modifica della selezione; 

2. determinare il nome del file XML corrispondente; 

3. effettuare una richiesta AJAX; 

4. leggere il contenuto del file XML; 

5. estrarre i dati dei prodotti; 

6. visualizzare i prodotti nella pagina. 

La richiesta dovrà essere realizzata utilizzando jQuery. 

#### **3.3 Struttura dei file XML dei prodotti** 

Ogni categoria dovrà essere descritta da un file XML distinto. 

Un possibile formato è il seguente: 

<?xml version="1.0" encoding="UTF-8"?> <prodotti categoria="elettronica"> <prodotto> <id>1</id> <nome>Smartphone Example</nome> <descrizione> Smartphone con display ad alta risoluzione e fotocamera avanzata. </descrizione> <prezzo>499.99</prezzo> <marca>ExampleTech</marca> <immagine>immagini/smartphone.jpg</immagine> <disponibilita>Disponibile</disponibilita> </prodotto> <prodotto> <id>2</id> <nome>Cuffie wireless</nome> <descrizione> Cuffie Bluetooth con cancellazione del rumore. </descrizione> <prezzo>89.90</prezzo> <marca>SoundExample</marca> <immagine>immagini/cuffie.jpg</immagine> <disponibilita>Disponibile</disponibilita> </prodotto> </prodotti> 

Ogni file XML dovrà contenere almeno cinque prodotti. 

Bisognerà fornire un file di XML Schema che descrive il formato dei dati definito. 

#### **3.4 Visualizzazione dei prodotti** 

I prodotti dovranno essere visualizzati dinamicamente all’interno della pagina. 

Per ogni prodotto dovrà essere generata una scheda contenente almeno: 

- immagine; 

- nome del prodotto; 

- marca; 

- descrizione breve; 

- prezzo; 

- disponibilità; 

- pulsante per aggiungere il prodotto al carrello. 

L’interfaccia dovrà essere organizzata in modo chiaro, ad esempio utilizzando una griglia di prodotti, schede di dimensioni uniformie, spaziatura coerente, immagini proporzionate; 

#### **3.5 Ricerca dei prodotti** 

La pagina dovrà contenere una casella di ricerca che consenta di filtrare i prodotti visualizzati. 

La ricerca dovrà considerare almeno: 

- il nome del prodotto; 

- la descrizione; 

- la marca. 

La ricerca dovrà essere effettuata mediante parole chiave contenute nei dati del prodotto. 

Esempio: 

Parola cercata: wireless 

Dovranno essere visualizzati soltanto i prodotti nella cui descrizione, nome o marca compare la parola wireless. 

La ricerca dovrà: 

- ignorare la differenza tra maiuscole e minuscole; 

- aggiornare l’elenco dei prodotti senza ricaricare la pagina; 

- funzionare anche mentre l’utente digita; 

- mostrare un messaggio se nessun prodotto corrisponde alla ricerca. 

La ricerca dovrà agire sui prodotti della categoria attualmente selezionata. 

#### **3.6 Ordinamento dei prodotti** 

La pagina dovrà contenere un controllo per ordinare i prodotti. 

L’ordinamento potrà essere realizzato mediante un menu a discesa o un pop-up. 

Dovranno essere disponibili almeno i seguenti criteri: 

- prezzo crescente; 

- prezzo decrescente; 

- nome alfabetico crescente; 

- nome alfabetico decrescente. 

L’ordinamento dovrà essere effettuato sul lato client, utilizzando JavaScript, senza effettuare una nuova richiesta AJAX. 

Il filtraggio e l’ordinamento dovranno poter essere utilizzati contemporaneamente. Ad esempio, l’utente dovrà poter: 

1. selezionare una categoria; 

2. cercare la parola bluetooth; 

3. ordinare i risultati per prezzo crescente. 

#### **3.7 Finestra modale con i dettagli del prodotto** 

Cliccando sul nome, sull’immagine o sul pulsante “Visualizza dettagli” di un prodotto, dovrà essere mostrata una finestra modale. 

La modale dovrà essere costruita e popolata dinamicamente sulla base dei dati del prodotto selezionato. Bisogna realizzarla con: 

- un elemento HTML inizialmente nascosto; 

- CSS per la sovrapposizione alla pagina; 

- jQuery per mostrare, aggiornare e nascondere la finestra. 

La modale dovrà poter essere chiusa: 

- cliccando sul pulsante di chiusura; 

- cliccando eventualmente sull’area esterna alla finestra; 

- premendo il tasto Esc. 

#### **3.8 Aggiunta dei prodotti al carrello** 

Ogni prodotto dovrà disporre di un pulsante “Aggiungi al carrello”. 

Poiché il backend non sarà ancora disponibile, il pulsante non dovrà effettuare una reale operazione di salvataggio. 

Al click sul pulsante dovrà essere mostrato un messaggio mediante alert(). Il messaggio dovrà contenere il nome e l’id del prodotto selezionato. 

Il codice dovrà essere organizzato in modo tale che, in una versione futura, l’istruzione alert() possa essere sostituita da una richiesta AJAX verso un backend. 

### **4. Seconda pagina: gestione del carrello** 

La seconda pagina, ad esempio carrello.html, dovrà visualizzare il contenuto del carrello. 

Il contenuto non dovrà essere scritto direttamente nell’HTML, ma dovrà essere letto tramite AJAX da un file XML. La pagina dovrà contenere almeno: 

- intestazione; 

- collegamento per tornare al catalogo; 

- titolo “Carrello”; 

- area per la visualizzazione dei prodotti; 

- quantità di ciascun prodotto; 

- prezzo unitario; 

- totale parziale; 

- totale complessivo; 

- pulsanti per modificare la quantità; 

- pulsanti per rimuovere un prodotto. 

#### **4.1 File XML del carrello** 

Il file, ad esempio carrello.xml, potrà avere una struttura simile alla seguente: 

<?xml version="1.0" encoding="UTF-8"?> <carrello> <elemento> <idProdotto>1</idProdotto> <nome>Smartphone Example</nome> <prezzoUnitario>499.99</prezzoUnitario> <quantita>1</quantita> <immagine>immagini/smartphone.jpg</immagine> </elemento> <elemento> <idProdotto>2</idProdotto> <nome>Cuffie wireless</nome> <prezzoUnitario>89.90</prezzoUnitario> <quantita>2</quantita> <immagine>immagini/cuffie.jpg</immagine> </elemento> </carrello> 

Il file dovrà contenere almeno due elementi del carrello. 

Bisognerà fornire un file di XML Schema che descrive il formato dei dati definito. 

#### **4.2 Caricamento AJAX del carrello** 

Quando la pagina viene caricata, dovrà essere effettuata una richiesta AJAX verso il file XML del carrello. 

L’applicazione dovrà: 

1. leggere il file XML; 

2. individuare gli elementi del carrello; 

3. creare dinamicamente le righe o le schede del carrello; 

4. calcolare il totale di ciascun elemento; 

5. calcolare il totale complessivo. 

#### **4.3 Modifica della quantità** 

Ogni prodotto presente nel carrello dovrà avere controlli per modificare la quantità. 

È possibile utilizzare: 

- un campo numerico; 

- un pulsante +; 

- un pulsante −; 

- un pulsante “Aggiorna quantità”. 

Quando l’utente modifica la quantità, dovrà essere mostrato un alert(). È comunque richiesto che il totale visualizzato nella pagina possa essere ricalcolato lato client in base alla nuova quantità. 

#### **4.4 Rimozione di un prodotto** 

Ogni elemento del carrello dovrà avere un pulsante per la rimozione. 

Al click sul pulsante dovrà essere mostrato un messaggio mediante alert(). La rimozione lato client potrà eliminare immediatamente l’elemento dalla pagina e aggiornare il totale. 

### **5. Requisiti tecnici** 

Il progetto dovrà rispettare i seguenti requisiti: 

1. utilizzare HTML5 valido e semanticamente organizzato; 

2. utilizzare un file CSS esterno; 

3. utilizzare file JavaScript esterni; 

4. utilizzare jQuery per le richieste AJAX; 

5. caricare i dati dei prodotti dai file XML; 

6. utilizzare un file XML diverso per ciascuna categoria; 

7. utilizzare AJAX anche per il caricamento del carrello; 

8. evitare la duplicazione del codice; 

9. utilizzare funzioni JavaScript con responsabilità specifiche; 

#### **5.1 Funzionalità minime obbligatorie** 

Il progetto sarà considerato completo se include almeno le seguenti funzionalità: 

- selezione di almeno tre categorie; 

- caricamento AJAX di un file XML diverso per ogni categoria; 

- visualizzazione dinamica dei prodotti; 

- ricerca per parola chiave; 

- ordinamento per prezzo; 

- ordinamento alfabetico; 

- apertura della modale con i dettagli; 

- pulsante per aggiungere al carrello; 

- messaggio alert() per l’aggiunta; 

- seconda pagina dedicata al carrello; 

- caricamento AJAX del carrello da XML; 

- visualizzazione della quantità; 

- modifica della quantità tramite alert(); 

- rimozione del prodotto tramite alert(); 

- calcolo del totale degli elementi; 

- calcolo del totale complessivo; 

#### **5.2 Risultato atteso** 

Al termine del progetto dovrà essere possibile aprire la pagina principale, selezionare una categoria, caricare i relativi prodotti da un file XML, cercare e ordinare i risultati, visualizzare i dettagli di un prodotto e simulare l’aggiunta al carrello. 

Dalla pagina del catalogo dovrà inoltre essere possibile accedere alla pagina del carrello, dove i dati dovranno essere caricati da un secondo file XML e dove l’utente potrà simulare la modifica della quantità e la rimozione dei prodotti. 
