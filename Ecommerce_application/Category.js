export default function categoryReducer(
  state = {
    isLoading: false,
    isError: false,
    successMessage: '',
    errorMessage: '',
    categories: [],
    questions: [],
    answers: [],
  },
  action,
) {
  const CATEGORIES = 'CATEGORIES';

  switch (action.type) {
    case `${CATEGORIES}_GET_PENDING`:
      return {
        ...state,
        isLoading: true,
        isError: false,
        successMessage: '',
        errorMessage: '',
      };
    case `${CATEGORIES}_GET_SUCCESS`:
      return {
        ...state,
        categories: action.data.categories,
        questions: action.data.questions,
        isLoading: false,
        isError: false,
        successMessage: action.data.msg,
        errorMessage: '',
      };

    case `${CATEGORIES}_GET_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true,
        successMessage: '',
        errorMessage: action.data.msg,
      };
    case `STORE_${CATEGORIES}`:
      return {
        ...state,
        isLoading: false,
        isError: false,
        answers: action.data,
        successMessage: '',
        errorMessage: '',
      };
    default:
      return state;
  }
}
