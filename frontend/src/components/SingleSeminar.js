import React from 'react'
import { Redirect, withRouter} from 'react-router-dom';

class SingleSeminar extends React.Component {
    constructor (props) {
        super(props);
        this.deleteCard = this.deleteCard.bind(this);
        this.state = {
            adminToken: localStorage.getItem('token'),
            deleted: false,
        }
    }
    deleteCard () {
		let myHeaders = new Headers();
        myHeaders.append("Authorization", `Token ${this.state.adminToken}`);
        fetch(`/api/card/${this.props.data.slug}/delete`, {
            method: 'DELETE',
            headers: myHeaders,
        }).then(() => {
            this.setState({
                deleted: true,
            });
            this.props.refresh();
        });
    }
    render () {
        const {src, date, classNum, title, type } = this.props.data;
        return (
            <div>
                {this.state.deleted && <Redirect to="/r" />}
                <img src={src} alt={title} />
                <h1>{title}</h1>
                <span>{date}</span>
                <p>{classNum} - {type == "Семинаы" ? "Семинар" : "Семестровые задачи"}</p>
                {this.state.adminToken && <button onClick={this.deleteCard}>Удалить</button>}
            </div>
        );
    }
}
export default withRouter(SingleSeminar);