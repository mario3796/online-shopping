import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Form from '../../shared/components/FormElements/Form';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorMessage from '../../shared/components/Error/ErrorMessage';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

import { AuthContext } from '../../shared/context/auth-context';
import { modalActions } from '../../shared/store/modal-slice';

const NewProduct = (props) => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + 'products/' + params.id
        );
        const data = await response.json();
        setProduct({ ...data.product });
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message || 'something went wrong!');
      }
    };
    if (props.editing) {
      fetchProduct();
    }
  }, [params, props.editing, setProduct]);

  const addProductHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('price', product.price);
    formData.append('image', product.image);
    formData.append('description', product.description);
    for (const pair of formData.entries())
      console.log(pair[0] + ': ' + pair[1]);
    let method, url;
    if (props.editing) {
      method = 'PUT';
      url = process.env.REACT_APP_BACKEND_URL + 'products/' + params.id;
    } else {
      method = 'POST';
      url = process.env.REACT_APP_BACKEND_URL + 'products';
    }
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: authCtx.token,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      dispatch(
        modalActions.editProduct({
          editing: props.editing,
          close: () => dispatch(modalActions.close()),
        })
      );
      console.log(data);
      setIsLoading(false);
      history.push('/');
    } catch (err) {
      setError(err.message || 'something went wrong!');
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Form onSubmit={addProductHandler} encType="multipart/form-data">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        defaultValue={product.title}
        onChange={(event) =>
          setProduct({ ...product, title: event.target.value })
        }
        type="text"
        name="title"
      />
      <Input
        defaultValue={product.price}
        onChange={(event) =>
          setProduct({ ...product, price: event.target.value })
        }
        type="number"
        name="price"
        step=".01"
      />
      <Input
        onChange={(event) =>
          setProduct({ ...product, image: event.target.files[0] })
        }
        type="file"
        accept=".png, .jpg, .jpeg"
        name="image"
      />
      <Input
        textarea
        name="description"
        rows="5"
        onChange={(event) =>
          setProduct({ ...product, description: event.target.value })
        }
        defaultValue={product.description}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default NewProduct;
