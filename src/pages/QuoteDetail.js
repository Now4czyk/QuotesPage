import { Route, useParams, Link, useRouteMatch } from 'react-router-dom';
import { useEffect } from 'react';
import Comments from '../components/comments/Comments';
import HighlightedQuote from '../components/quotes/HighlightedQuote';
import useHttp from '../hooks/use-http';
import { getSingleQuote } from '../lib/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const QuoteDetail = () => {
	const params = useParams();
	const match = useRouteMatch();

	const { quoteId } = params;

	const {
		sendRequest,
		status,
		data: loadedQuote,
		error,
	} = useHttp(getSingleQuote, true);

	useEffect(() => {
		sendRequest(quoteId);
	}, [sendRequest, quoteId]);

	if (status === 'pending') {
		return (
			<div className='centered'>
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return <p className='centered'>{error}</p>;
	}

	if (!loadedQuote.text) {
		return <p>No comments found</p>;
	}

	return (
		<>
			<HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
			<Route path={match.url} exact>
				<div className='centered'>
					<Link className='btn--flat' to={`${match.url}/comments`}>
						Load Comments
					</Link>
				</div>
			</Route>

			<Route path={`${match.url}/comments`}>
				<Comments quoteId = {quoteId}/>
			</Route>
		</>
	);
};
export default QuoteDetail;
