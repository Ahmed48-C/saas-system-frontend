import React from 'react'

const isEmpty = (field) => {
    return field === null || field === undefined || field === '';
}

export default isEmpty