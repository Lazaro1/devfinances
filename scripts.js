const Modal = {
    OpenModal() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    CloseModal(){
        document.querySelector('.modal-overlay').classList.remove('active')
    },
    OpenModalSafe() {
        document.querySelector('.modal-overlay-safe').classList.add('active')
    },
    CloseModalSafe(){
        document.querySelector('.modal-overlay-safe').classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(Transaction))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}


const DOM =  {

    TransactionsContainer: document.querySelector('#data-table tbody'),
    

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.TransactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${(index)})" src="./assets/minus.svg" alt="Remover transação">
            </td>    
        `

        return html
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.TransactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(amount){
        amount = Number(amount) * 100
        

        return amount;
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency: "BRL"
        })

        return signal + value
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    // get safe values
    moneysafe: document.querySelector('input#amountsafe'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
            moneysafe: Form.date.value
        }
    },

    validateFields(e) {
        const {description, amount, date, moneysafe} = Form.getValues()
        
        if (e === true) {
            if (moneysafe.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            } 
        }else{
            console.log(e)
            if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            }
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault();       
        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction)
            Form.clearFields();
            Modal.CloseModal();
        } catch (error) {
            alert(error.message)
        }
    },

    submitSafe(event) {
        event.preventDefault();

        Form.validateFields(true);
    }


}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()
