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
import { useHttpClient } from '../../shared/hooks/http-hook';
import Empty from '../../shared/components/Empty/Empty';

const NewProduct = (props) => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
  });

  const { isLoading, error, sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + 'products/' + params.id
      );
      setProduct({ ...data.product });
      console.log(data);
    };
    if (props.editing) {
      fetchProduct();
    }
  }, [params, props.editing, sendRequest, setProduct]);

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
    const data = await sendRequest(url, method, formData, {
      Authorization: authCtx.token,
    });

    dispatch(
      modalActions.editProduct({
        editing: props.editing,
        close: () => dispatch(modalActions.close()),
      })
    );
    console.log(data);
    history.push('/');
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : props.editing && !product.title ? (
    <Empty>
      <p>No such a Product!</p>
    </Empty>
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
