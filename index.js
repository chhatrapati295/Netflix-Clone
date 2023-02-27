const apiKey = 'cb4bcd23588985c02fedbd26178bc5d8'
const apiEndpoint = 'https://api.themoviedb.org/3/'
const imgPath = "https://image.tmdb.org/t/p/original";
const container= document.querySelector('#movies-cont')
const bannerContent = document.querySelector('.banner-content')

const apiPaths = {
    allCategories : `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList : (id)=> `${apiEndpoint}discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apiKey}`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0oR7YZsCRBjHVQXAlFSZ0Jgy1TRSC8cQ`
}

function movieTrailer (movieName){
    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res=>res.json())
    .then(res=>{
        const bestResult = res.items[0]
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
        console.log(youtubeUrl)
        window.open(youtubeUrl,'_blank')
    })
    .catch(err=>console.error(err))
}
const MoviesSection = (categoryName,id)=>{
    fetch(apiPaths.fetchMoviesList(id))
    .then(res=>res.json())
    .then(res=>{
        
        const div = document.createElement('div')
        div.className = 'movies-section'
        div.classList.add('container')
        const moviesListHTML = (res.results).map(item=>{
            return `
            <img src="${imgPath}${item.backdrop_path}" alt="" class="movie-item" onClick='movieTrailer("${item.title}")'>
            `
        }).join('')
        div.innerHTML = `
        <span class='sectionHeading'>${categoryName} <span class='exploreNudge'>Explore All</span></span>
        <div class='imagesRow'>${moviesListHTML}</div>
        `
        container.append(div)
        // console.log(moviesListHTML)
    })
    .catch(err=>console.error(err))
}
const buildAllCategories = (category,id)=>{
    // console.log(category.name,id)
    MoviesSection(category.name,id)

}
const init = ()=>{
    fetch(apiPaths.allCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres
        categories.slice(1).map(category=>{
            buildAllCategories(category,category.id)
        })
    })
    .catch(err=>console.error(err))
}
const buildBanner = ()=>{
    fetch(apiPaths.fetchTrending)
    .then(res=>res.json())
    .then(res=>{
        const div = document.createElement('div')
        div.className = 'banner-content-text'
        console.log(res)
        let index = Math.floor(Math.random()* (res.results.length))
        const data = res.results[index]
        console.table(data)
        bannerContent.style.backgroundImage = `url("${imgPath}${data.backdrop_path}")`
        const divHtml = `
        <h2 class="banner-title">${!data.title ? 'Dark Dream' : data.title}</h2>
                <h2 class="banner-info"><span> #${index} in Trending Movies</span> | ${!data.release_date ? '2022-11-3' : data.release_date}</h2>
                <p class="banner-overview"> ${data.overview}</p>
                <div class="action-buttons-cont">
                    <button class="action-button">
                        <span class="btn1"><i class="fa-solid fa-play"></i></span>
                        <span class="two">Play</span>
                    </button>
                    <button class="action-button">
                        <span class="btn1"><i class="fa-solid fa-circle-info"></i></span>
                        <span class="two">More Info</span>
                    </button>
                </div>
        `
        div.innerHTML = divHtml
        bannerContent.append(div)
    })
    .catch(err=>console.error(err))
}
window.addEventListener('DOMContentLoaded',()=>{
    init()
    buildBanner()
    window.addEventListener('scroll',()=>{
        const header = document.querySelector('header')
        if(window.scrollY > 5){
            header.classList.add('bg-dark')
        }else{
            header.classList.remove('bg-dark')
        }
    })
})