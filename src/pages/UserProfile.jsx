import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { req } from '../utils/request';
import { errorAlert } from '../utils/alert';

import PostList from '../components/PostList';

class UserProfile extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: null,
            discriminator: null,
            id: props.match.params.id,
            avatarURL: null,
            permissions: [],
            following: [],
            follower: [],
            notFound: true
        };
    }

    async componentDidMount() {
        const res = await req({
            query: `
                query {
                    user(id: "${this.state.id}") {
                        username
                        discriminator
                        id
                        avatarURL
                        following {
                            username
                            discriminator
                            id
                            avatarURL
                        }
                        follower {
                            username
                            discriminator
                            id
                            avatarURL
                        }
                    }
                }
            `
        })
        if (res.errors) {
            await errorAlert({
                title: '유저 불러오기를 실패했습니다'
            })
            history.back()
        }
        else if (!res.data.user) {
            this.setState({ notFound: true })
        }
        else {
            const data = res.data.user
            this.setState({
                notFound: false,
                username: data.username,
                discriminator: data.discriminator,
                avatarURL: data.avatarURL,
                following: data.following,
                follower: data.follower
            })
        }
    }

    render() {
        return (
            <div className = 'mt-16'>
                {
                    !this.state.notFound ? (
                        <div className = 'w-4/5 mx-auto gap-4 sm:grid sm:grid-cols-4'>
                            <div className = 'w-full h-96 rounded-3xl shadow-xl border-black border-2 border-opacity-5 text-center'>
                                <img src = {this.state.avatarURL} alt = 'User Avatar' className = 'mx-auto mt-4 rounded-circle' />
                                <h2 className = 'text-xl font-semibold'>{this.state.username}#{this.state.discriminator}</h2>
                            </div>
                        </div>
                    ) : (
                        <h1 className = 'font-black text-3xl text-center'>유저가 없습니다</h1>
                    )
                }
            </div>
        )
    }
}

export default UserProfile;
