/** @jsx jsx */
import React from "react";
import ReactDOM from "react-dom";
import { Component } from 'react';
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';

import Select from 'react-select';
import { defaultTheme } from 'react-select';

const options = [
    {value: '1', label: 'Item 1'},
    {value: '2', label: 'Item 2'},
    {value: '3', label: 'Item 3'},
    {value: '4', label: 'Item 4'},
    {value: '5', label: 'Item 5'},
    {value: '6', label: 'Item 6'},
    {value: '7', label: 'Item 7'},
]

const { colors } = defaultTheme;

const selectStyles = (style) => ({
    control: provided => ({ ...provided, minWidth: 240, margin: 8}),
    menu: () => ({
        ...style,
        boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
    }),
});

class searchableDropDown extends Component {
    state = { isOpen: false, value: this.props.value };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value)         this.setState({value: this.props.value });

    }

    toggleOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen, value: state.value }));
    };
    onSelectChange = value => {
        this.toggleOpen();
        this.setState({ value });
        if(value && value.value) this.props.onChange(value.value);
    };
    render() {
        const { isOpen, value } = this.state;
        return (
            <Dropdown
                isOpen={isOpen}
                onClose={this.toggleOpen}
                target={
                    <Button
                        iconAfter={<ChevronDown />}
                        onClick={this.toggleOpen}
                        isSelected={isOpen}
                    >
                        {value && this.props.hideValue === false ? `${value.label}` :this.props.placeholder }
                    </Button>
                }
            >
                <div>
                    <Select
                        autoFocus
                        backspaceRemovesValue={false}
                        components={{ DropdownIndicator, IndicatorSeparator: null }}
                        controlShouldRenderValue={false}
                        hideSelectedOptions={false}
                        isClearable={this.props.isClearable}
                        menuIsOpen
                        onChange={this.onSelectChange}
                        options={this.props.data}
                        placeholder="Search..."
                        styles={{...selectStyles(this.props.style)}}
                        tabSelectsValue={false}
                        value={value}
                        hideValue={this.props.hideValue}
                    />
                </div>
            </Dropdown>
        );
    }
}

searchableDropDown.defaultProps = {
    data : options,
    isClearable: false,
    placeholder: 'Please Make a Selection',
    hideValue : false
}
// styled components

const Menu = props => {
    const shadow = 'hsla(218, 50%, 10%, 0.1)';
    return (
        <div
            css={{
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
                marginTop: 8,
                position: 'absolute',
                zIndex: 2,
            }}
            {...props}
        />
    );
};
const Blanket = props => (
    <div
        css={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1,
        }}
        {...props}
    />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div css={{ position: 'relative'}}>
        {target}
        {isOpen ? <Menu>{children}</Menu> : null}
        {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
);
const Svg = p => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);
const ChevronDown = () => (
    <Svg style={{ marginRight: -6 }}>
        <path
            d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </Svg>)

export default searchableDropDown