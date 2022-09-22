import React, { Component } from 'react';

import { req } from '../utils/request';
import { errorAlert, confirmAlert } from '../utils/alert';

class NewCategory extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: null,
            description: null
        };
    }

    async componentDidMount() {
        if (!localStorage.token)
            await errorAlert({ text: '로그인이 필요한 화면입니다' })
    }

    createCategory = async e => {
        e.preventDefault()
        const alertRes = await confirmAlert({
            title: '정말 생성을 할까요?',
            confirmButtonText: '생성'
        })
        if (!alertRes.isConfirmed) return;
        const res = await req({
            query: `
                mutation {
                    addCategory(data: {
                        name: "${this.state.name}"
                        description: "${this.state.description}"
                    })
                }
            `
        })

        if (res.data && res.data.addCategory) {
            this.props.history.push(`/category/${this.state.name}`)
        }
        else {
            await errorAlert({
                title: '생성을 실패했습니다'
            })
        }
    }

    render() {
        return (
            <div className = 'w-4/5 mx-auto mt-20'>
                <h2 className = 'text-2xl font-semibold text-gray-900 select-none'>카테고리 생성</h2>
                <form onSubmit = {this.createCategory} className = 'mt-4'>
                    <input className = 'w-full h-10 appearance-none rounded-xl border border-gray-400 block pl-2 py-2 bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none' placeholder = '이름' onChange = {e => {
                        this.setState({ name: e.target.value })
                    }} required />
                    <input className = 'w-full h-10 mt-2 appearance-none rounded-xl border border-gray-400 block pl-2 py-2 bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none' placeholder = '설명' onChange = {e => {
                        this.setState({ description: e.target.value })
                    }} required />
                    <button type = 'submit' className = 'w-full h-10 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl border-r-2 mt-2'>
                        만들기!
                    </button>
                </form>
            </div>
        )
    }
}

export default NewCategory;
