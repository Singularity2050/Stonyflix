
////////////////
// Title List //
////////////////

// Title List Container
import React from "react";
import imageData from '../utils/image.json'
import {useMutate} from "restful-react";
import {
    addMyCourseAPI,
    courseDetailInfoAPIMethod,
    deleteMyCourseAPI,
    findMyInfoAPIMethod,
    userInfoAPIMethod
} from "../api/client";

var createClass = require('create-react-class');
var i = -1;

export var Assignment = createClass({


    getInitialState: function() {
        return {data: imageData.cse, mounted: false, lectureData:this.props.lecture};
    },

    loadContent: function() {
        const user = JSON.parse(sessionStorage.getItem('userData'));
        findMyInfoAPIMethod(user.occupation,user.id).then( r =>{
            sessionStorage.removeItem('identity');
            sessionStorage.setItem('identity',JSON.stringify(r));
            this.setState({lectureData: r === null? []: r.myCourseInfo})
            console.log(this.state.lectureData);
        })
    },
    componentDidMount: function() {
        this.loadContent();
        this.setState({ mounted: true });
    },
    componentWillUnmount: function() {
        this.setState({ mounted: false });
    },
    render: function() {
        let index =this.state.data.length -1;

        return (
            <div ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
                <div className="Title">
                    <h1>{this.props.title}</h1>
                    <div className="titles-wrapper">
                        {this.state.lectureData.map( (e) => {
                            return ( <Item imageLink={this.state.data[index--]} lecture={e} userData={this.props.user}/>);
                        })}
                    </div>
                </div>
            </div>
        );
    }
});

// Title List Item
export function Item(e){
    let dynamicData;
    let courseData;
    let isTaking = false;
    let isLecture = false;
    console.log(e);
    if(e.lecture !== undefined){
        isLecture = true;
    }

    // console.log(e.lecture.Assignments[0].aname);
    console.log(e);
    const isAssignment = e.lecture.Assignments[0].aname !== "";

    return (
        <>
            {isLecture ?
                isAssignment?
                <div className="Item"  style={{backgroundImage: 'url(' + e.imageLink + ')'}} >
                    <a href={e.lecture.Assignments[0].aname} target="_blank" rel="noopener noreferrer">
                        <div className="overlay">
                            <div className="title">Course: {e.lecture.cname}</div>
                            <div className="plot">Due Date: {e.lecture.Assignments[0].dueDate}</div>
                        </div>
                    </a>
                </div>
                    :<></>
                : <></>}
        </>
    );
};

// ListToggle
var ListToggle = createClass({
    getInitialState: function() {
        return({ toggled: this.props.isToggle })
    },
    handleClick: function(e) {
        e.preventDefault()
        if(this.state.toggled === true) {
            this.setState({ toggled: false });
            deleteMyCourseAPI(this.props.courseId,this.props.studentId).then(r => console.log(r));

        } else {
            addMyCourseAPI(this.props.courseId,this.props.studentId).then(r => console.log(r));
            this.setState({ toggled: true });
        }
    },
    render: function() {

        return (
            <div onClick={this.handleClick} data-toggled={this.state.toggled} className="ListToggle">
                <div>
                    <i className="fa fa-fw fa-plus"  ></i>
                    <i className="fa fa-fw fa-check"></i>
                </div>
            </div>
        );

    }
});

export default Assignment;
