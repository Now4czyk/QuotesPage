import { useState, useEffect, useCallback } from 'react';
import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from '../comments/CommentsList';

const Comments = (props) => {
	const [isAddingComment, setIsAddingComment] = useState(false);
	const  quoteId  = props.quoteId;

	const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

	useEffect(() => {
		sendRequest(quoteId);
	}, [sendRequest, quoteId]);

	const startAddCommentHandler = () => {
		setIsAddingComment(true);
	};

	const addCommentHandler = useCallback(() => {
		sendRequest(quoteId);
	}, [sendRequest, quoteId]);

	let comments;

	if (status === 'pending') {
		comments = (
			<div className='centered'>
				<LoadingSpinner />
			</div>
		);
	}

	if (status === 'completed' && loadedComments && loadedComments.length > 0) {
		comments = <CommentsList comments={loadedComments} />;
	}

	if (
		status === 'completed' &&
		(!loadedComments || loadedComments.length === 0)
	) {
		comments = <p className='centered'>No comments were found yet</p>;
	}
	return (
		<section className={classes.comments}>
			<h2>User Comments</h2>
			{!isAddingComment && (
				<button className='btn' onClick={startAddCommentHandler}>
					Add a Comment
				</button>
			)}
			{isAddingComment && (
				<NewCommentForm quoteId={quoteId} onAddedComment={addCommentHandler} />
			)}
			{comments}
		</section>
	);
};

export default Comments;
