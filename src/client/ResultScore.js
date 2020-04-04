import React from 'react';

export const ResultScore = ( props ) =>
{
	const { topResults } = props;
	return (
		<React.Fragment>
			 <h1>The Game is Over</h1>
                    Your score
                    { topResults.map( ( result, index ) =>
				<p key={ index }>{ result }</p>) }
		</React.Fragment>
	);
}