
const form = document.querySelector(".form")
const inputSearch =  document.querySelector("#meal")
const buttomSearch = document.querySelector(".Search-button")

const cardContainer  = document.querySelector(".card-container")

// busca na api pelo nome
const searchMeal = async (meal) =>{
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`) 

         console.log(response.data)
          return response.data

 } catch(erro) {
    console.log(erro + 'api')
 }
 
}

// evento de busca
buttomSearch.addEventListener("click" , async (e) => {
    e.preventDefault()

    // verifica se o input estar vazio 
    const inputValue = inputSearch.value
    if(inputValue === "") return

    cardContainer.innerHTML = "" // limpar o container dos cards

    // function recebe os dados da api e coloca na variavel
    const data = await searchMeal(inputValue) 


    // loop pelo array de objs
    data.meals.forEach((item) => {
         // info api
        const nomeMeal = item.strMeal
        const mealImg = item.strMealThumb
        const mealId = item.idMeal

        addInfoPage(nomeMeal , mealImg , mealId)
    })
})

// add information to the page
const addInfoPage = async (name , img , id) => {
        const div = document.createElement("div")
        div.classList.add("card")

        const mealCardHtml = `
                    <div class="meal-card" data-id="${id}">
                        <div class="img-card">
                            <img class="card-img" src="${img}">
                        </div>
                        <h3 class="card-title">${name}</h3>
                        <p class="card-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit itaque nam exercitationem consequatur cupiditate totam qui autem quia dolore excepturi! Amet deserunt dolore reiciendis ducimus asperiores unde magni fugiat libero.</p>
                    </div>     
        `
        div.innerHTML = mealCardHtml
        cardContainer.appendChild(div) 

}

// random meal (trazendo uma refição aleatoria)
const randomMeal = async () => {    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/random.php`)
        return response.data

    } catch (erro){
        console.log("erro ao buscar refeiçao aleatória " + erro)
    }
}   

//  funcao que faz varias busca na api
const getMultipleMeal = async (caunt) => { 
    for(let i = 1 ; i <=  caunt;  i++) {

       const data = await randomMeal() // busco as info

       data.meals.forEach((item) => { // loop 

        const nameMeal =  item.strMeal
        const imgMeal = item.strMealThumb
        const idMeal = item.idMeal

        addInfoPage(nameMeal,imgMeal , idMeal) // add na página
       })
    }
}
getMultipleMeal(5)


// modal
const modalContainer = document.querySelector(".modal-container")
const closeModalButton = document.querySelector(".close-modal")
const modalContent = document.querySelector(".modal-content")
const listIngredientes = document.querySelector(".list-ingredientes")
const headerModal = document.querySelector(".header-modal")
const imgModal = document.querySelector(".img-modal")
const listPreparo = document.querySelector(".list-preparo")

let time 
const debounce = async (e) => {
    clearTimeout(time)

    time = setTimeout( async () => {
        // busca dentro do container o elemento que tem a class meal-card
       if(e.target.closest(".meal-card")){
        openModal()
        // o button que foi clicado com a class meal-card, eu pego o atributo dataID
        const CardId = e.target.closest(".meal-card").getAttribute("data-id")

        // infomações api 
        const data = await getMealId(CardId)
        addInfoModal(data)
    }
    },1000)
    
}

//evento 
cardContainer.addEventListener("click" , debounce)

const openModal = () => {
    modalContainer.style.display = "flex"
}

const closeModal = () => {
    modalContainer.style.display = "none"
    listIngredientes.innerHTML = ""
    imgModal.innerHTML = ""
    listPreparo.innerHTML = ""
}

// fecha o modal quando é clicado fora 
modalContainer.addEventListener("click" , (e) => {
    const modal = e.target
    if(modal.getAttribute("class") === "modal-container"){
        closeModal()
    }
})

// fecha o modal
closeModalButton.addEventListener("click" , () => closeModal())

// more info meal 
const getMealId  = async (id) => {
    try{
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        return response.data
    }
    catch(erro) {
        console.log(erro)
    }
}

// add info in modal 
const addInfoModal = (data) => {

    // troca // title sempre atualizado 
    const modalTitle = document.querySelector(".modal-title")

   data.meals.forEach((item) => {
    const nameMeal = item.strMeal
    const imgMeal = item.strMealThumb

    // title modal 
    const modalTitleMeal = document.createElement("h3")
    modalTitleMeal.classList.add("modal-title")
    modalTitleMeal.textContent = nameMeal

    // troca
    headerModal.replaceChild(modalTitleMeal , modalTitle)

    //img modal
    const imgModalMeal = document.createElement("img")
    imgModalMeal.src = imgMeal
    imgModal.appendChild(imgModalMeal)
    
    // ingredientes 
    for(let i = 1 ; i <= 20 ; i++){
        if(!item[`strIngredient${i}`] == ""){
            let liIngredientes = document.createElement("li")
 
            liIngredientes.innerText = item[`strIngredient${i}`]

            listIngredientes.appendChild(liIngredientes)
        }
        
        //PREPARO
        if(item[`strMeasure${i}`].trim() == "") {
            break
        }
        liPreparoMeal = document.createElement("li")
            liPreparoMeal.innerHTML = item[`strMeasure${i}`]
            listPreparo.appendChild(liPreparoMeal)
    }
})

}

ScrollReveal().reveal('.card-container' , {
    origin: 'left', 
    duration: 2000,
    distance: '20%'
}); 

    
