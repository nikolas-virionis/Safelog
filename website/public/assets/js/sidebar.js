if (sessionStorage.getItem("usuario")) {
    cargo = JSON.parse(sessionStorage.getItem("usuario")).cargo;
} else if (sessionStorage.getItem("staff")) {
    cargo = JSON.parse(sessionStorage.getItem("staff")).cargo;
} else {
    cargo = "padrao";
}
// console.log(cargo)
// -----------------------------------------------------------------------------------------------
//  Criação da Sidebar
// -----------------------------------------------------------------------------------------------

//<div class="sidebar close">
let sideBarDiv = document.createElement("div");
sideBarDiv.classList = "sidebar close";
//<div class="logo-details">
let logoDetailsDiv = document.createElement("div");
logoDetailsDiv.classList = "logo-details";
//<div>
let divLogoIcon = document.createElement("div");
//<img src="assets/img/logo/logo-icon-branco.png" alt="">
let imgLogoIcon = document.createElement("img");
imgLogoIcon.setAttribute("src", "assets/img/logo/logo-icon-branco.png");
//</div>
divLogoIcon.appendChild(imgLogoIcon);
//<span class="logo_name">
let spanLogoName = document.createElement("span");
spanLogoName.classList = "logo_name";
//<img src="assets/img/logo/logo-escrita-branco.png" alt="">
let imgLogoEscrito = document.createElement("img");
imgLogoEscrito.setAttribute("src", "assets/img/logo/logo-escrita-branco.png");
//</span>
spanLogoName.appendChild(imgLogoEscrito);
//</div>
logoDetailsDiv.appendChild(divLogoIcon);
logoDetailsDiv.appendChild(spanLogoName);
//<ul class="nav-links">
let ulNavLinks = document.createElement("ul");
ulNavLinks.setAttribute("class", "nav-links");
//<li class="li-not-selected">
let liItem1 = document.createElement("li");
liItem1.classList = "li-not-selected";
//<a href="dashboard">
let linkToDash = document.createElement("a");
linkToDash.setAttribute("href", "dashboard");
//<i class='bx bxs-bar-chart-alt-2'></i>
let iconToDash = document.createElement("i");
iconToDash.classList = "bx bxs-bar-chart-alt-2";
//<span class="link_name">Dashboard</span>
let spanHoverDash = document.createElement("span");
spanHoverDash.classList = "link_name";
spanHoverDash.innerHTML = "Dashboard";
//</a>
linkToDash.appendChild(iconToDash);
linkToDash.appendChild(spanHoverDash);
//<ul class="sub-menu blank">
let ulSubMenuDash = document.createElement("ul");
ulSubMenuDash.classList = "sub-menu blank";
//<li>
let liSubMenuDash = document.createElement("li");
//<a class="link_name" href="dashboard">Dashboard</a>
let linkToDashMini = document.createElement("a");
linkToDashMini.setAttribute("href", "dashboard");
linkToDashMini.innerHTML = "Dashboard";
//</li>
liSubMenuDash.appendChild(linkToDashMini);
//</ul>
ulSubMenuDash.appendChild(liSubMenuDash);
//</li>
liItem1.appendChild(linkToDash);
liItem1.appendChild(ulSubMenuDash);

if (cargo == "staff") {
    let liItemStaff1 = document.createElement("li");
    liItemStaff1.classList = "li-not-selected";
    //<a href="cadastro-empresa">
    let linkToCadEmpresa = document.createElement("a");
    linkToCadEmpresa.setAttribute("href", "cadastro-empresa");
    //<i class="fas fa-building"></i>
    let iconToCadEmpresa = document.createElement("i");
    iconToCadEmpresa.classList = "fas fa-building";
    //<span class="link_name">Cadastro empresa</span>
    let spanHoverCadEmpresa = document.createElement("span");
    spanHoverCadEmpresa.classList = "link_name";
    spanHoverCadEmpresa.innerHTML = "Cadastro";
    //</a>
    linkToCadEmpresa.appendChild(iconToCadEmpresa);
    linkToCadEmpresa.appendChild(spanHoverCadEmpresa);
    //<ul class="sub-menu blank">
    let ulSubMenuCadEmpresa = document.createElement("ul");
    ulSubMenuCadEmpresa.classList = "sub-menu blank";
    //<li>
    let liSubMenuCadEmpresa = document.createElement("li");
    //<a class="link_name" href="cadastro-empresa">Cadastro empresa</a>
    let linkToCadEmpresaMini = document.createElement("a");
    linkToCadEmpresaMini.setAttribute("href", "cadastro-empresa");
    linkToCadEmpresaMini.innerHTML = "Cadastro empresa";
    //</li>
    liSubMenuCadEmpresa.appendChild(linkToCadEmpresaMini);
    //</ul>
    ulSubMenuCadEmpresa.appendChild(liSubMenuCadEmpresa);
    //</li>
    liItemStaff1.appendChild(linkToCadEmpresa);
    liItemStaff1.appendChild(ulSubMenuCadEmpresa);

    //<li class="li-not-selected">
    let liItem2 = document.createElement("li");
    liItem2.classList = "li-not-selected";
    //<a href="perfil">
    let linkToProfile = document.createElement("a");
    linkToProfile.setAttribute("href", "perfil");
    //<i class='bx bxs-user'></i>
    let iconToProfile = document.createElement("i");
    iconToProfile.classList = "bx bxs-user";
    //<span class="link_name">Perfil</span>
    let spanHoverProfile = document.createElement("span");
    spanHoverProfile.classList = "link_name";
    spanHoverProfile.innerHTML = "Perfil";
    //</a>
    linkToProfile.appendChild(iconToProfile);
    linkToProfile.appendChild(spanHoverProfile);
    //<ul class="sub-menu blank">
    let ulSubMenuProfile = document.createElement("ul");
    ulSubMenuProfile.classList = "sub-menu blank";
    //<li>
    let liSubMenuProfile = document.createElement("li");
    //<a class="link_name" href="perfil">Perfil</a>
    let linkToProfileMini = document.createElement("a");
    linkToProfileMini.setAttribute("href", "perfil");
    linkToProfileMini.innerHTML = "Perfil";
    //</li>
    liSubMenuProfile.appendChild(linkToProfileMini);
    //</ul>
    ulSubMenuProfile.appendChild(liSubMenuProfile);
    //</li>
    liItem2.appendChild(linkToProfile);
    liItem2.appendChild(ulSubMenuProfile);

    ulNavLinks.appendChild(liItemStaff1);
    ulNavLinks.appendChild(liItem2);
} else {
    //<li class="li-not-selected">
    let liItem2 = document.createElement("li");
    liItem2.classList = "li-not-selected";
    //<a href="perfil">
    let linkToProfile = document.createElement("a");
    linkToProfile.setAttribute("href", "perfil");
    //<i class='bx bxs-user'></i>
    let iconToProfile = document.createElement("i");
    iconToProfile.classList = "bx bxs-user";
    //<span class="link_name">Perfil</span>
    let spanHoverProfile = document.createElement("span");
    spanHoverProfile.classList = "link_name";
    spanHoverProfile.innerHTML = "Perfil";
    //</a>
    linkToProfile.appendChild(iconToProfile);
    linkToProfile.appendChild(spanHoverProfile);
    //<ul class="sub-menu blank">
    let ulSubMenuProfile = document.createElement("ul");
    ulSubMenuProfile.classList = "sub-menu blank";
    //<li>
    let liSubMenuProfile = document.createElement("li");
    //<a class="link_name" href="perfil">Perfil</a>
    let linkToProfileMini = document.createElement("a");
    linkToProfileMini.setAttribute("href", "perfil");
    linkToProfileMini.innerHTML = "Perfil";
    //</li>
    liSubMenuProfile.appendChild(linkToProfileMini);
    //</ul>
    ulSubMenuProfile.appendChild(liSubMenuProfile);
    //</li>
    liItem2.appendChild(linkToProfile);
    liItem2.appendChild(ulSubMenuProfile);

    //<li class="li-not-selected">
    let liItem3 = document.createElement("li");
    liItem3.classList = "li-not-selected";
    //<a href="relatorio">
    let linkToRelatorio = document.createElement("a");
    linkToRelatorio.setAttribute("href", "relatorio");
    //<i class='bx bx-paperclip'></i>
    let iconToRelatorio = document.createElement("i");
    iconToRelatorio.classList = "bx bx-paperclip";
    //<span class="link_name">Relatório</span>
    let spanHoverRelatorio = document.createElement("span");
    spanHoverRelatorio.classList = "link_name";
    spanHoverRelatorio.innerHTML = "Relatório";
    //</a>
    linkToRelatorio.appendChild(iconToRelatorio);
    linkToRelatorio.appendChild(spanHoverRelatorio);
    //<ul class="sub-menu blank">
    let ulSubMenuRelatorio = document.createElement("ul");
    ulSubMenuRelatorio.classList = "sub-menu blank";
    //<li>
    let liSubMenuRelatorio = document.createElement("li");
    //<a class="link_name" href="relatorio">Relatório</a>
    let linkToRelatorioMini = document.createElement("a");
    linkToRelatorioMini.setAttribute("href", "relatorio");
    linkToRelatorioMini.innerHTML = "Relatório";
    //</li>
    liSubMenuRelatorio.appendChild(linkToRelatorioMini);
    //</ul>
    ulSubMenuRelatorio.appendChild(liSubMenuRelatorio);
    //</li>
    liItem3.appendChild(linkToRelatorio);
    liItem3.appendChild(ulSubMenuRelatorio);

    //<li class="li-not-selected">
    let liItem4 = document.createElement("li");
    liItem4.classList = "li-not-selected";
    //<a href="dependentes">
    let linkToDependentes = document.createElement("a");
    linkToDependentes.setAttribute("href", "dependentes");
    let iconToDependentes;
    if (cargo == "analista") {
        // <i class="fas fa-desktop"></i>
        iconToDependentes = document.createElement("i");
        iconToDependentes.classList = "fas fa-desktop";
    } else {
        //<i class='bx bxs-group'></i>
        iconToDependentes = document.createElement("i");
        iconToDependentes.classList = "bx bxs-group";
    }

    //<span class="link_name">Dependentes</span>
    let spanHoverDependentes = document.createElement("span");
    spanHoverDependentes.classList = "link_name";
    spanHoverDependentes.innerHTML = "Dependentes";
    //</a>
    linkToDependentes.appendChild(iconToDependentes);
    linkToDependentes.appendChild(spanHoverDependentes);
    //<ul class="sub-menu blank">
    let ulSubMenuDependentes = document.createElement("ul");
    ulSubMenuDependentes.classList = "sub-menu blank";
    //<li>
    let liSubMenuDependentes = document.createElement("li");
    //<a class="link_name" href="dependentes">Dependentes</a>
    let linkToDependentesMini = document.createElement("a");
    linkToDependentesMini.setAttribute("href", "dependentes");
    linkToDependentesMini.innerHTML = "Dependentes";
    //</li>
    liSubMenuDependentes.appendChild(linkToDependentesMini);
    //</ul>
    ulSubMenuDependentes.appendChild(liSubMenuDependentes);
    //</li>
    liItem4.appendChild(linkToDependentes);
    liItem4.appendChild(ulSubMenuDependentes);

    //<li class="seta">
    let liItem5 = document.createElement("li");
    liItem5.classList = "seta";
    //<div class="iocn-link">
    let divIconLink1 = document.createElement("div");
    divIconLink1.classList = "iocn-link";
    //<a href="#">
    let linkDropChamado = document.createElement("a");
    linkDropChamado.setAttribute("href", "chamados");
    //<i class="fab fa-java"></i>
    let iconToChamado = document.createElement("i");
    iconToChamado.classList = "fas fa-exclamation";
    //<span class="link_name">Client Chamado</span>
    let spanHoverChamado = document.createElement("span");
    spanHoverChamado.classList = "link_name";
    spanHoverChamado.innerHTML = "Chamados";
    //</a>
    linkDropChamado.appendChild(iconToChamado);
    linkDropChamado.appendChild(spanHoverChamado);
    //<i class="bx bxs-chevron-down arrow"></i>
    let iconSetaChamado = document.createElement("i");
    iconSetaChamado.classList = "bx bxs-chevron-down arrow";
    //</div>
    divIconLink1.appendChild(linkDropChamado);
    divIconLink1.appendChild(iconSetaChamado);
    //<ul class="sub-menu">
    let ulSubMenuChamado = document.createElement("ul");
    ulSubMenuChamado.classList = "sub-menu";
    //<li>
    // let liChamado1 = document.createElement("li");
    //     //<a class="link_name" href="#">Client Chamado</a>
    //     let linkToChamado1Mini = document.createElement("a");
    //     linkToChamado1Mini.setAttribute("href", "#");
    //     linkToChamado1Mini.innerHTML = "Client Chamado";
    //</li>
    // liChamado1.appendChild(linkToChamado1Mini);
    //<li>
    let liChamado2 = document.createElement("li");
    //<a href="#">Download</a>
    let linkNovoChamado = document.createElement("a");
    linkNovoChamado.setAttribute("href", "novo-chamado");
    linkNovoChamado.innerHTML = "Abrir Chamado";
    //</li>
    liChamado2.appendChild(linkNovoChamado);
    //<li>
    let liChamado3 = document.createElement("li");
    //<a href="#">Baixar JRE</a>
    let linkListaChamado = document.createElement("a");
    linkListaChamado.setAttribute("href", "chamados");
    linkListaChamado.innerHTML = "Lista de chamados";
    //</li>
    liChamado3.appendChild(linkListaChamado);
    //</ul>
    // ulSubMenuChamado.appendChild(liChamado1);
    ulSubMenuChamado.appendChild(liChamado2);
    ulSubMenuChamado.appendChild(liChamado3);
    //</li>
    liItem5.appendChild(divIconLink1);
    liItem5.appendChild(ulSubMenuChamado);

    //<li class="seta">
    let liItem6 = document.createElement("li");
    liItem6.classList = "seta";
    //<div class="iocn-link">
    let divIconLink = document.createElement("div");
    divIconLink.classList = "iocn-link";
    //<a href="#">
    let linkDropJava = document.createElement("a");
    linkDropJava.setAttribute("href", "#");
    //<i class="fab fa-java"></i>
    let iconToJava = document.createElement("i");
    iconToJava.classList = "fab fa-java";
    //<span class="link_name">Client Java</span>
    let spanHoverJava = document.createElement("span");
    spanHoverJava.classList = "link_name";
    spanHoverJava.innerHTML = "Client Java";
    //</a>
    linkDropJava.appendChild(iconToJava);
    linkDropJava.appendChild(spanHoverJava);
    //<i class="bx bxs-chevron-down arrow"></i>
    let iconSetaJava = document.createElement("i");
    iconSetaJava.classList = "bx bxs-chevron-down arrow";
    //</div>
    divIconLink.appendChild(linkDropJava);
    divIconLink.appendChild(iconSetaJava);
    //<ul class="sub-menu">
    let ulSubMenuJava = document.createElement("ul");
    ulSubMenuJava.classList = "sub-menu";
    //<li>
    // let liJava1 = document.createElement("li");
    //     //<a class="link_name" href="#">Client Java</a>
    //     let linkToJava1Mini = document.createElement("a");
    //     linkToJava1Mini.setAttribute("href", "#");
    //     linkToJava1Mini.innerHTML = "Client Java";
    //</li>
    // liJava1.appendChild(linkToJava1Mini);
    //<li>
    let liJava2 = document.createElement("li");
    //<a href="#">Download</a>
    let linkDownloadJava = document.createElement("a");
    linkDownloadJava.setAttribute("href", "#");
    linkDownloadJava.innerHTML = "Download";
    //</li>
    liJava2.appendChild(linkDownloadJava);
    //<li>
    let liJava3 = document.createElement("li");
    //<a href="#">Baixar JRE</a>
    let linkJreJava = document.createElement("a");
    linkJreJava.setAttribute("href", "#");
    linkJreJava.innerHTML = "Baixar JRE";
    //</li>
    liJava3.appendChild(linkJreJava);
    //</ul>
    // ulSubMenuJava.appendChild(liJava1);
    ulSubMenuJava.appendChild(liJava2);
    ulSubMenuJava.appendChild(liJava3);
    //</li>
    liItem6.appendChild(divIconLink);
    liItem6.appendChild(ulSubMenuJava);

    //<li>

    ulNavLinks.appendChild(liItem1);
    ulNavLinks.appendChild(liItem2);
    ulNavLinks.appendChild(liItem3);
    ulNavLinks.appendChild(liItem4);
    ulNavLinks.appendChild(liItem5);
    ulNavLinks.appendChild(liItem6);
}

let liItem6 = document.createElement("li");
//<div class="profile-details">
let divProfileDetails = document.createElement("div");
divProfileDetails.classList = "profile-details";
//<div class="profile-content">
let divProfileContent = document.createElement("div");
divProfileContent.classList = "profile-content";
//<img class="profilePic" src="" alt="profileImg">
let imgProfilePic = document.createElement("img");
imgProfilePic.classList = "profilePic";
// imgProfilePic.setAttribute("src", "");
//</div>
divProfileContent.appendChild(imgProfilePic);
//<div class="name-job">
let divNameJob = document.createElement("div");
divNameJob.classList = "name-job";
//<div class="profile_name"></div>
let divProfileName = document.createElement("div");
divProfileName.classList = "profile_name";
//</div>
divNameJob.appendChild(divProfileName);
//<div class="icon-exit">
let divIconExit = document.createElement("div");
divIconExit.classList = "icon-exit";
//<a href="#">
let linkBoxExit = document.createElement("a");
linkBoxExit.setAttribute("href", "#");
//<i class='bx bx-log-out'></i>
let iconExit = document.createElement("i");
iconExit.classList = "bx bx-log-out";
//</a>
linkBoxExit.appendChild(iconExit);
//</div>
divIconExit.appendChild(linkBoxExit);
//</div>
divProfileDetails.appendChild(divProfileContent);
divProfileDetails.appendChild(divNameJob);
divProfileDetails.appendChild(divIconExit);
//</li>
liItem6.appendChild(divProfileDetails);
//</ul>

ulNavLinks.appendChild(liItem6);

sideBarDiv.appendChild(logoDetailsDiv);
sideBarDiv.appendChild(ulNavLinks);

document.querySelector("body").appendChild(sideBarDiv);

// -----------------------------------------------------------------------------------------------
//  Funcionalidade da Sidebar
// -----------------------------------------------------------------------------------------------
let arrow = document.querySelectorAll(".seta");
arrow.forEach(arr => {
    arr.addEventListener("mouseenter", e => {
        let arrowParent = e.target; //selecting main parent of arrow
        arrowParent.classList.add("showMenu");
    });
    arr.addEventListener("mouseleave", e => {
        let arrowParent = e.target; //selecting main parent of arrow
        arrowParent.classList.remove("showMenu");
    });
});
let sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("click", () => sidebar.classList.toggle("close"));

let homeSection = document.querySelector(".home-section");
homeSection.addEventListener("click", () => sidebar.classList.add("close"));

const nomeUser = document.querySelector(".profile_name");
const profilePic = document.querySelector(".profilePic");

[nomeUser, profilePic].forEach(el => {
    el.addEventListener("click", evt => {
        redirectTo("perfil");
    });
    el.classList.add("clickble");
    el.title = "Perfil";
});

nomeUser.innerText =
    JSON.parse(sessionStorage.getItem("usuario"))?.nome?.split(" ").shift() ??
    JSON.parse(sessionStorage.getItem("staff"))?.nome?.split(" ").shift() ??
    "Nome usuario";

document.querySelector(".icon-exit").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "/";
});

const redirectTo = url => {
    window.location.href = "./" + url;
};
