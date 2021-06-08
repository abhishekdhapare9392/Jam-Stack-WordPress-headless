var api_uri = 'http://localhost/wp-jam-tutorial/wp-json/wp/v2'
var blogList = document.getElementById('blogs-list')
var searchInput = document.getElementById('search-input')
var searchBtn = document.getElementById('search-btn')

document.addEventListener('DOMContentLoaded', async function (e) {
  var res = await fetch(`${api_uri}/posts`)
  var data = await res.json()
  renderBlogs(data)
})

function renderBlogs(data) {
  var blogs = data
  blogs.forEach(async function (blog) {
    let {
      title,
      excerpt,
      content,
      id,
      featured_media,
      author,
      date,
      status,
    } = blog

    let img = await getImage(featured_media)
    let div = document.createElement('div')
    div.className = 'col-md-8 py-3 m-auto'
    let card = `
            <div class="card">
                <div class="row">
                    <div class="col-md-2">
                        <img src="${img}" alt="${title.rendered}" width="100%"  height="auto"/>
                    </div>
                    <div class="col-md-10 py-3">
                        <h1 class="h3">${title.rendered}</h1>
                        <p class="text-justify">
                            ${excerpt.rendered}
                        </p>
                    </div>
                </div>
            </div>
        `

    div.innerHTML = card
    blogList.appendChild(div)
  })
}

async function getImage(id) {
  var res = await fetch(`${api_uri}/media/${id}`)
  var data = await res.json()
  return data.media_details.sizes.thumbnail.source_url
}

searchBtn.addEventListener('click', function (e) {
  searchBlogs(searchInput.value)
})

async function searchBlogs(searchValue) {
  blogList.innerHTML = ''
  var search = searchValue
  var res = await fetch(
    `${api_uri}/search?search=${search}&type=post&subtype=post`,
  )
  var data = await res.json()
  data.forEach(async function (dt) {
    var resposnse = await fetch(`${dt._links.self[0].href}`)
    var singleData = await resposnse.json()
    var singleBlog = []
    singleBlog[0] = singleData
    renderBlogs(singleBlog)
  })
}
