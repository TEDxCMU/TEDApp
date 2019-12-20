import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Styles from './button.module.scss'

const header = (props) => {
	return <button
        type="button"
        disabled={props.disabled}
        onClick={props.onClick}
        className={classNames(Styles[`btn`], Styles[`btn--${props.variant}`])}
    >
        {props.children}
    </button>
}

header.propTypes = {
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string
}

export default header;