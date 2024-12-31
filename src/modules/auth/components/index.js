import { Button, FormInput as Input, Checkbox } from '@/uiCore';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';

export const FormAuth = (props) => {
    const { title, subtitle, linkSubtitle, handleSubmit, lableSubmit, titleFooter, linkTitleFooter, loading, rememberPassword, disabled } = props;

    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-column align-items-center justify-content-center">
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{title}</div>
                            {linkSubtitle ? (
                                <Link to={linkSubtitle}>
                                    <Button icon="pi pi-arrow-left" label={subtitle} text />
                                </Link>
                            ) : <span className="text-600 font-medium">{subtitle}</span>}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {props.children}

                            {titleFooter && <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    {rememberPassword && (
                                        <Fragment>
                                            <Checkbox inputid="rememberme"className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme">Remember me</label>
                                        </Fragment>
                                    )}
                                </div>
                                <Link to={linkTitleFooter} className="font-medium no-underline text-right" style={{ color: 'var(--primary-color)' }}>
                                    {titleFooter}
                                </Link>
                            </div>}
                            <Button disabled={disabled} loading={loading} label={lableSubmit || 'Submit'} className="w-full p-3 text-xl" ></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export const FormInput = (props) => {
    const { id, label, placeholder, onChange, ...inputProp } = props;

    return (
        <Fragment>
            <label htmlFor={id} className="block text-900 text-xl font-medium mb-2">{label}</label>
            <Input label={label} id={id} onChange={onChange} {...inputProp} required
                placeholder={placeholder || `Enter ${label.toLowerCase()}`} className="md:w-30rem" style={{ padding: '1rem' }} />
        </Fragment>
    )
};
