import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>)
});

test('renders the contact form header', () => {
    render(<ContactForm />)
    const headerElement = screen.queryByText(/Contact Form/i)
    expect(headerElement).toBeInTheDocument()
    expect(headerElement).toBeTruthy()
    expect(headerElement).toHaveTextContent(/Contact Form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, 'abc');
    const errorMessages = await screen.findAllByTestId('error')
    expect(errorMessages).toHaveLength(1)
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)
    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error')
        expect(errorMessages).toHaveLength(3)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstNameField = screen.queryByText(/First Name*/i)
    const lastNameField = screen.queryByText(/Last Name*/i)
    userEvent.type(firstNameField, 'Robert')
    userEvent.type(lastNameField, 'Smith')
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)
    const errorMessage = screen.getAllByTestId('error')
    expect(errorMessage).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailField = screen.getByLabelText(/Email*/i)
    userEvent.type(emailField, 'notanemail')
    const errorMessage = await screen.findByText(/email must be a valid email address/i)
    expect(errorMessage).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)
    const errorText = await screen.findByText(/lastName is a required field/i)
    expect(errorText).toBeInTheDocument()
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstNameField = screen.getByLabelText(/First Name*/i)
    const lastNameField = screen.getByLabelText(/Last Name/i)
    const emailField = screen.getByLabelText(/Email*/i)
    const submitButton = screen.getByRole('button')
    userEvent.type(emailField, 'user@email.com')
    userEvent.type(firstNameField, 'Robert')
    userEvent.type(lastNameField, 'Smith')
    userEvent.click(submitButton)
    await waitFor(() => {
        const firstnameDisplay = screen.queryByText('Robert')
        const lastnameDisplay = screen.queryByText('Smith')
        const emailDisplay = screen.queryByText('user@email.com')
        const messageDisplay = screen.queryByTestId('messageDisplay')
        expect(firstnameDisplay).toBeInTheDocument()
        expect(lastnameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).not.toBeInTheDocument()
      })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    const firstNameField = screen.getByLabelText(/First Name*/i)
    const lastNameField = screen.getByLabelText(/Last Name/i)
    const emailField = screen.getByLabelText(/Email*/i)
    const messageField = screen.getByLabelText(/Message*/i)
    const submitButton = screen.getByRole('button')
    userEvent.type(emailField, 'user@email.com')
    userEvent.type(firstNameField, 'Robert')
    userEvent.type(lastNameField, 'Smith')
    userEvent.type(messageField, 'This is a message.')
    userEvent.click(submitButton)
    await waitFor(() => {
        const firstnameDisplay = screen.queryByText('Robert')
        const lastnameDisplay = screen.queryByText('Smith')
        const emailDisplay = screen.queryByText('user@email.com')
        const messageDisplay = screen.queryByText('This is a message.')
        expect(firstnameDisplay).toBeInTheDocument()
        expect(lastnameDisplay).toBeInTheDocument()
        expect(emailDisplay).toBeInTheDocument()
        expect(messageDisplay).toBeInTheDocument()
      })
});
