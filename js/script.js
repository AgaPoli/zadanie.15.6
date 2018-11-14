$(document).ready(function() {
	/*dodaj instrukcję, która sprawi,
	   że kod naszej aplikacji zacznie się wykonywać dopiero po
	   załadowaniu całego drzewa DOM. Całą resztę naszego kodu JS
	   będziemy dodawać wewnątrz. */
	/*Każda kolumna oraz karteczka musi być unikalnym obiektem, żeby zapobiec tworzeniu duplikatów.
	Funkcja randomString() generuje id, które składa się z ciągu 10 losowo wybranych znaków (funkcja losuje 
	10 elementów z tablicy znaków chars i składa je w jeden string.)*/
	function randomString() {
		var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
		var str = '';
		for (var i = 0; i < 10; i++) {
			str += chars[Math.floor(Math.random() * chars.length)];
		}
		return str;
	}
	/*Podstawowe klasy i obiekt tablicy
	Zacznijmy od stworzenia klas Column i Card oraz obiektu board (nie ma potrzeby tworzyć klasy dla board, 
	ponieważ tablica będzie tylko jedna). Przypominam, że nazwy klas przyjęło się pisać wielką literą,
	natomiast obiektów małą.*/
	//funkcja konstruująca kolumny (klasa)
	function Column(name) {
		var self = this; // useful for nested functions
		this.id = randomString();
		this.name = name;
		this.$element = createColumn();
		/*W przykładzie widzisz kilka standardowych elementów, jak name,
		$element czy metodę do tworzenia nowych karteczek. Natomiast
		id generujemy za pomocą wcześniej utworzonej funkcji
		randomString(). Przy tworzeniu nowej instancji klasy Column
		tworzony jest też element jQuery. Dzieje się to po wywołaniu
		funkcji createColumn(). */
		function createColumn() {
			// CREATING COMPONENTS OF COLUMNS
			/*Tę funkcję możemy podzielić na trzy główne segmenty:
			tworzenie elementów, z których będzie składała się kolumna,
			podpinanie odpowiednich zdarzeń,
			konstruowanie kolumny i jej zwrócenie.*/
			var $column = $('<div>').addClass('column');
			/*Ten element będzie divem - dodajemy do niego klasę o takiej
			           samej nazwie (column)*/
			var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
			/*Ustawiamy jej klasę na column-title 
			           oraz wypełniamy tekstem za pomocą metody text(). Sam tekst, którym chcemy wypełnić tytuł,
			           znajduje się we właściwości name. Dostaniemy się do niej przez zmienną self (this nie zadziała z powodu utraty kontekstu).*/
			var $columnCardList = $('<ul>').addClass('column-card-list'); /*lista na kartki-ma byc w środku kolumny  */
			/*możliwości dodawania nowej karty i usuwania listy,
			więc na stronie musimy pokazać dwa przyciski: */
			var $columnDelete = $('<button>').addClass('btn-delete');
			var $columnAddCard = $('<button>').addClass('add-card').text('Add card');
			var $columnDeleteIcon = $('<i>').addClass('fas fa-times-circle');
			var $columnAddCardIcon = $('<i>').addClass('fas fa-plus-circle');
			/*<div class="column">
<h2 class="column-title">Column name</h2>
<button class="btn-delete">x</button>
<button class="add-card">Add a card</button>
<ul class="column-card-list"></ul>
</div> 
this.$element wskazuje na div.column*/
			// ADDING EVENTS Podpinanie zdarzeń
			/* aby po kliknięciu w odpowiednie elementy można było usunąć kolumnę lub dodać nową kartę do kolumny.
			Więc zanim połączymy odpowiednio elementy (klocki, z których jest zbudowana kolumna), dodajemy nasłuchiwania zdarzeń.
			Kod który powstanie w wyniku tej części również trafi do createColumn()*/
			$columnDelete.click(function() {
				self.removeColumn();
			});
			$columnAddCard.click(function(event) {
				self.addCard(new Card(prompt("Enter the name of the card")));
			});
			/*obecność funkcji prompt() - za jej pomocą pobieramy 
			           po prostu od użytkownika nazwę kolumny, którą chce stworzyć. */
			// Konstruowanie kolumny
			/*Ostatnim krokiem tworzenia funkcji createColumn() jest połączenie wszystkich węzłów w odpowiedniej kolejności. 
			Najpierw tytuł, potem przyciski delete i addCard, a na końcu lista kart: */
			$column.append($columnTitle).append($columnDelete).append($columnAddCard).append($columnCardList);
			$columnDelete.append($columnDeleteIcon);
			$columnAddCard.append($columnAddCardIcon);
			// RETURN OF CREATED COLUMN
			return $column;
			/*Element kolumny należy zwrócić! (return $column). 
			           Bez tego nie mielibyśmy odniesienia do stworzonego elementu tam, gdzie wywołujemy funkcję. */
		}
	}
	//Metody dla klasy Column
	/**My chcemy dodawać kolejne karty do div.column > ul, więc za pomocą jQuery pobieramy wszystkie dzieci ul kolumny. 
     Tak więc za pomocą this.$element.children('ul') dostaliśmy się do właściwej listy. Teraz możemy podpiąć do niej 
     kartę za pomocą append(card.$element). 
     card.$element- Naszą kartę będziemy konstruować w sposób analogiczny do tego, w jaki konstruowaliśmy kolumnę. Tak
więc obiekt karty będzie posiadał w sobie właściwość $element, gdzie będzie trzymany węzeł DOM */
	Column.prototype = {
		addCard: function(card) {
			this.$element.children('ul').append(card.$element);
		},
		/*removeColum kasuje kolumnę. Za pomocą metody remove() usuwamy po prostu element
		       ze strony. this.$element.remove() usunie naszą kolumnę w momencie, w którym przyciśniemy przycisk “x" */
		removeColumn: function() {
			this.$element.remove();
		}
	};
	//funkcja konstruująca karty (klasa)
	function Card(description) {
		var self = this;
		this.id = randomString();
		this.description = description;
		this.$element = createCard();
		/*Funkcja: createCard()
		Tę funkcję możemy podzielić na trzy segmenty, tak jak poprzednio:
		tworzenie elementów, z których będzie składała się karta,
		podpinanie odpowiednich zdarzeń pod stworzone elementy,
		konstruowanie karty i jej zwrócenie. */
		function createCard() {
			/*Funkcja: createCard()
			           Tę funkcję możemy podzielić na trzy segmenty, tak jak poprzednio:
			           tworzenie elementów, z których będzie składała się karta,
			           podpinanie odpowiednich zdarzeń pod stworzone elementy,
			           konstruowanie karty i jej zwrócenie. */
			// CREATING THE BLOCKS
			var $card = $('<li>').addClass('card');
			var $cardDescription = $('<p>').addClass('card-description').text(self.description);
			var $cardDelete = $('<button>').addClass('btn-delete');
			var $cardDeleteIcon = $('<i>').addClass('fas fa-times-circle');
			/*Element listy (czyli karta), opis karty w paragrafie oraz przycisk do usuwania karty. */
			// BINDING TO CLICK EVENT Podpinanie zdarzeń
			$cardDelete.click(function() {
				self.removeCard();
			});
			// COMBINING BLOCKS AND RETURNING THE CARD
			$card.append($cardDelete).append($cardDescription);
			$cardDelete.append($cardDeleteIcon);
			return $card;
		}
	}
	/* <li class="card">
	<button class="btn-delete">x</button>
	<p>Description of the card</p>
</li>
     */
	//Metoda dla klasy Card 
	/*metodą, którą musimy zaimplementować w przypadku karty, jest jej usunięcie.*/
	Card.prototype = {
		removeCard: function() {
			this.$element.remove();
		}
	}
	//Obiekt tablicy 
	/*Musimy jednak stworzyć obiekt tablicy w JavaScripcie i przypiąć odpowiednie nasłuchiwania zdarzeń */
	var board = {
		name: 'Kanban Board',
		addColumn: function(column) {
			this.$element.append(column.$element);
			initSortable();
			/*Metoda ta ma za zadanie stworzyć kolumnę dzięki przypięciu jej
			           elementu do elementu tablicy. */
		},
		/*this.$element wskazuje na board.$element. W tej właściwości
		       trzymany jest poprawny element kontenera tablicy. Zgodnie ze
		       strukturą HTML znajdziemy go, używając następującego selektora: $('#board .column-container')*/
		$element: $('#board .column-container')
	};
	/*Na początku, w ustaleniach, założyliśmy, że tablica kanban będzie
	miała funkcjonalność przenoszenia kart z jednego miejsca do
	innego (np. do innej kolumny albo do innej pozycji w tej samej
	kolumnie). W tym celu dodaliśmy sobie rozszerzenie jQueryUI.
	Dzięki niemu możemy korzystać z opcji drag'n'drop, która pozwala
	nam przenosić elementy na stronie. Dodatkowo biblioteka
	udostępnia metodę sortable, dzięki której możemy sortować
	elementy listy za pomocą metody przeciągnij i upuść.
	Implementacja tej funkcji wygląda następująco: */
	function initSortable() {
		$('.column-card-list').sortable({
			connectWith: '.column-card-list',
			placeholder: 'card-placeholder'
		}).disableSelection();
		/*disableSelection by nie bylo możliwości zaznaczania tekstuna kartach, które przeciągamy. 
		       Nie chcemy, aby omyłkowo podczas przeciągania, zaznaczał nam się tekst. */
		/*connectWith to atrybut, dzięki któremu możemy wybrać listę, w której będzie działać sortowanie. */
		/*placeholder trzyma nazwę klasy, która pojawia się po najechaniu na puste pole, na które chcemy upuścić przenoszony element.
Klasa przykładowego placeholdera, który znajduje się poniżej, to przeźroczysty element z czarnym kreskowanym obramowaniem. */
	}
	/*Nasza tablica ma w sobie przycisk służący do dodawania kolejnych kolumn. Trzeba podpiąć na ten element zdarzenie
kliknięcia, aby obsługiwało wrzucanie nowej kolumny do tablicy */
	$('.create-column').click(function() {
		var name = prompt('Enter a column name');
		var column = new Column(name);
		board.addColumn(column);
	});
	/*1. Wybieramy przycisk.
	2. Na kliknięcie ma się wykonać funkcja, która zapyta nas o
	nazwę kolumny, którą chcemy stworzyć.
	3. Funkcja utworzy też nową instancję, która z kolei ustawi tytuł
	kolumny.
	4. Następnie funkcja utworzy na tablicy nową kolumnę. */
	// CREATING COLUMNS
	var todoColumn = new Column('To do');
	var doingColumn = new Column('Doing');
	var doneColumn = new Column('Done');
	// ADDING COLUMNS TO THE BOARD
	board.addColumn(todoColumn);
	board.addColumn(doingColumn);
	board.addColumn(doneColumn);
	// CREATING CARDS
	var card1 = new Card('New task');
	var card2 = new Card('Create kanban boards');
	// ADDING CARDS TO COLUMNS
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);
});