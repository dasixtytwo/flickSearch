import React, { Component } from 'react';
import logo from './Formedix_logo_MAIN_RGB_2-01.png';
import ModalImage from './Components/ModalImage';
import Image from './Components/Image';
import ScrollTopButton from './Components/ScrollTopButton';
import Aux from './hoc/Auxiliary';
import './App.css';
import './assets/css/styles.css';


const { REACT_APP_FLICKR_KEY } = process.env
const API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search'

class App extends Component {
  constructor(props){
    super();
    // initialState
    this.state = {
      disableButton: true,
      query: 'random',
      pictures: [],
      per: 8,
      page: 1,
      totalPages: null,
      scrolling: false,
      showModal: false,
      url: '',
      title: '',
    }
  }
  
  // lifecycle method
  componentWillMount() {
    // call method loadPictures
    this.loadPictures()
    /* keep track of scroll event listener, this listen for the scroll event when it gets the scroll event  it's going to start a anonymous arrow function 
       as I am called and I go to call this function handleScroll and pass in the event that I got
    */ 
    this.scrollListener = window.addEventListener('scroll', (e) => {
      this.handleScroll(e)
    })
  }
  
  // This method is called if you scroll the page to bottom
  handleScroll = () => {
    // values from the state
    const { scrolling, totalPages, page} = this.state
    // check it's already scrolling
    if (scrolling) return
    /* check if the totalPages is less then or equal to the current page I gone return, if this is the case then I'm beyond the number of total pages 
       and there is nothing to load
    */
    if (totalPages <= page) return
    // save in a variable the the last elements 
    var lastCard = document.querySelector('.row > .card:last-child')
    // save in a variable the offsetTop the distance of the current element relative to the top 
    var lastCardOffset = lastCard.offsetTop + lastCard.clientHeight
    // save in the variable the number of pixels the document is currently scrolled + height of the browser window's viewport
    var pageOffset = window.pageYOffset + window.innerHeight
    // set a 20 pixel the value before the end of the bottom
    var bottomOffset = 20
    /* If the pageOffSet is greater than last Card element offSet minus the pixel setting in bottomOffset, call the method loadMore() 
       and load another page.
    */
    if (pageOffset > lastCardOffset - bottomOffset) {
      this.loadMore()
    }
    
  }

  /* Method used for load more pages, setting the state scrolling to true and take the previous value state and add 1, 
     this ia an asynchronous function, after I going to do a callback after this function is done, going to call loadPictures methods.
     The reason of this I want to make sure that the state is first updated with the new page number.
  */
  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page+1,
      scrolling: true,
    }), this.loadPictures)
  }

  // this method fetching data from flickr
  loadPictures = () => {
    const { per, page, pictures } = this.state
    const url = `${API_URL}&api_key=${REACT_APP_FLICKR_KEY}&tags=${this.state.query}&per_page=${per}&page=${page}&format=json&nojsoncallback=1`
    fetch(url)
      .then(res => res.json())
      .then(json => this.setState({
        /* override each of the pictures that I have already got in my pictures list use,  take whatever the previous pictures were and spread 
           them out over Json and then add the new pictures so the original context I had in the state, I am going to spread these out into the new array in the variable 
           the come from state and then json.photos.photo are the one I just fetched, and I going to append those to the same array using spread operator, so I am going to have
           a new array that's going to have all of the old pictures plus the new pictures
        */ 
        pictures: [...pictures, ...json.photos.photo], 
        // set to state to false
        scrolling: false,
        // fetching the json.photos.total and save into state
        totalPages: json.photos.total,
      }))
      .catch( err => { 
        //this catch method outputs a message to the alert box, should fetch fail to retrieve data
        alert("Something went wrong, could not access data", err);
      })
      
  }

  // this method is call when the user change the text on the input form
  handleChangeQuery = () => {
    // this change the state of the key inside the 
    this.setState({
      // set the new value of the query and search the image with the new value
      query: this.search.value,
      // set to empty the pictures array
      pictures: [],
      // set the key page at 1
      page: 1,
    }, () => {
      // check the state of the query and if the query is more than one characters call loadPictures with the new query.
      if (this.state.query && this.state.query.length > 1) {
        this.loadPictures()
      } 
    })
  }

  // Method for opening modal dialog
  openModal = (url, title, e) => {
    this.setState({
      showModal: true,
      url: url,
      title: title,
    })
  };

  // Method for closing modal dialog
  closeModal = () => {
    this.setState({
      showModal: false,
      url: '',
      title: '',
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App__header">
            <img src={logo} className="App__logo" alt="logo" />
            <h1 className="App__title">Welcome to Flickr Search</h1>
            <form className="searchForm">
              {/* ref select the input element and getting its value and pass this value at the query key in the state by handleChangeQuery methods*/}
              <input
                className="searchForm__input"
                placeholder="Search for..."
                ref={input => this.search = input}
                onChange={this.handleChangeQuery}
              />
              <button className="searchForm__button" disabled={this.state.disableButton}>
                <svg fill="#fff" height="24" viewBox="0 0 23 23" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
              </button>
            </form>
        </header>
        <div refs="flickr__container" className="flickr__container flickr__container--fluid">
          <div className="row">
              { 
                this.state.pictures.map((pic, index) => {
                  let url = `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`;
                  let title = pic.title;

                  return <Aux key={index}>
                    <div className="card">
                      <header className="card__title">{title}</header>
                      <Image className="card__thumbnail" src={url} alt={'Picture number ' + (index + 1)} />
                      {/* this is showed when the user go over the picture and click, the openmodal method is called and pass some params to the modal */}
                      <span className="card__icon--open fa fa-expand" value={url} onClick={(e) => this.openModal(url, title, e)}></span>
                    </div>
                  </Aux>
                })
              }
          </div>
          {/* this render the modal component, and is showed the image in overlay when user click on icon when go over the original image */}
          <ModalImage isOpen={this.state.showModal} onClick={this.closeModal} alt={this.state.title} src={this.state.url} title={this.state.title}/>
        </div>
        {/* this render the component for scroll of the top */}
        <ScrollTopButton scrollStepInPx="50" delayInMs="16.00"/>
      </div>
    )
  }
}
  
export default App;