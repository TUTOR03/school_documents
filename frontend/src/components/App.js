import React,{Component} from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import CardList from './CardList'
import SingleSeminar from './SingleSeminar'
import NavBar from './NavBar'
import Admin from './admin/Admin'

class App extends Component{
	constructor (props) {
		super(props);
		this.loadData = this.loadData.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {
			data: [],
			isLoading: true,
			hasError: false,
			filter: {
				query: '',
				classNum: null,
			},
		}
	}

	componentDidMount() {
		this.loadData();
	}

	loadData () {
		this.setState({
			isLoading: true,
		});
		const filter = this.state.filter;
		fetch('/api/cards')
		.then(response => response.json())
		.then(result => {
			const images = result.map(el => {
				if ((el.class_num == filter.classNum || !filter.classNum) && (el.title.indexOf(filter.query) != -1)) {
					return ({
						src: this.getImgName(el.image),
						date: el.post_date,
						classNum: el.class_num,
						title: el.title,
						type: el.type_num,
						slug: el.slug,
					});
				}
			});
			this.setState({
				data: images,
				isLoading: false,
			});
		}).catch(error => console.log('Error: ' + error));
	}

	handleSearch = (filters) => {
		if (this.state.filter != filters) {
			this.setState({
				filter: filters,
			}, () => this.loadData());
		}
	}

	getImgName (str) {
		return '/' + str.slice(str.indexOf('media'));
	}

	filterCards (filters) {
		this.setState({filters: filters.classNum});
	}

	render () {
		return(
			<div>
				{this.state.hasError ? 'Error!' : ''}
				<BrowserRouter>
					<NavBar handleSearch={this.handleSearch} adminToken={this.state.adminToken} />
					{this.state.isLoading ? 'Loading...' : (
						<Switch>
							<Route exact path='/r' render = {
								() => <CardList data={this.state.data.filter(e => e)} /> 
							}/>
							<Route path='/r/seminar/:id' render = {
								(props) => <SingleSeminar data={this.state.data.filter(e => e)[props.match.params.id]} id={props.match.params.id}/>
							} />
							<Route path='/r/admin' render = {
								(props) => <Admin adminToken={this.state.adminToken} path={props.match.path} url={props.match.url} />
							} />
						</Switch>
					)}
				</BrowserRouter>
			</div>
		);
	}
}
export default App;