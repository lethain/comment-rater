
[gwap]: http://en.wikipedia.org/wiki/Game_with_a_purpose "Game with a purpose on Wikipedia"

This simple prototype follows some of the [Game with a purpose][gwap] standards,
meaning that it implements this ideas:

* randomly assign individuals as pairs (prevent intentional collaboration to pollute results)
* require multiple pairs to evaluate each comment (find if opinions converge, throw out non-convering opinions)
* ...

## Installation

1. Install latest Node.js
2. Install the app itself

    clone this repository...
    cd comment_rater
    node rater.js

## Acknowledgements

[node]: http://nodejs.org/ "Node.js"
[nc]: http://github.com/ry/node_chat "Node Chat"
[digg-api]: http://digg.com/api/docs/overview "Digg API"

* [Node.js][node] is the underpinning.
* [node_chat][nc] provides some excellent examples of building both a client and a server. I also directly look ``fu.js`` from ``node_chat``.
* [Digg API][digg-api] is used to retrieve Digg comments.