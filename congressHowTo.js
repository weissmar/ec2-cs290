
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'mainHowTo'});
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPasscode'}));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3403);

function getMembersByState(context, req, callback){
	var responseCount = 2;
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURIHouse = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/house/';
	requestURIHouse += context.state + '/' + context.district + '/current.json?api-key=' + yourAPIKey;
	request(requestURIHouse, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.houseRepName = responseData.results[0].name;
			req.session.houseRepParty = responseData.results[0].party;
			req.session.houseRepId = responseData.results[0].id;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		responseCount--;
		if (responseCount == 0){
			var newContext = buildContext(context, req);
			callback(newContext);
		}
	});
	var requestURISenate = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/senate/';
	requestURISenate += context.state + '/current.json?api-key=' + yourAPIKey;
	request(requestURISenate, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.senateRep1Name = responseData.results[0].name;
			req.session.senateRep1Party = responseData.results[0].party;
			req.session.senateRep1Id = responseData.results[0].id;
			req.session.senateRep2Name = responseData.results[1].name;
			req.session.senateRep2Party = responseData.results[1].party;
			req.session.senateRep2Id = responseData.results[1].id;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		responseCount--;
		if (responseCount == 0){
			var newContext = buildContext(context, req);
			callback(newContext);
		}
	});
}

function buildContext(context, req){
	//context from New Query
	context.name = req.session.name;

	//context from Find My Members
	context.state = req.session.state;
	context.district = req.session.district;
	context.houseRepName = req.session.houseRepName;
	context.houseRepParty = req.session.houseRepParty;
	context.houseRepId = req.session.houseRepId;
	context.senateRep1Name = req.session.senateRep1Name;
	context.senateRep1Party = req.session.senateRep1Party;
	context.senateRep1Id = req.session.senateRep1Id;
	context.senateRep2Name = req.session.senateRep2Name;
	context.senateRep2Party = req.session.senateRep2Party;
	context.senateRep2Id = req.session.senateRep2Id;	

	//context from Member Bio
	context.memberFirstName = req.session.memberFirstName;
	context.memberLastName = req.session.memberLastName;
	context.memberBirthdate = req.session.memberBirthdate;
	context.memberUrl =	req.session.memberUrl;
	context.memberTwitter = req.session.memberTwitter;
	context.memberRole = [];
	for (var role in req.session.memberRole){
		context.memberRole.push({"number":req.session.memberRole[role].number, 
			"chamber":req.session.memberRole[role].chamber, 
			"title":req.session.memberRole[role].title,
			"state":req.session.memberRole[role].state, 
			"party":req.session.memberRole[role].party, 
			"district":req.session.memberRole[role].district, 
			"startDate":req.session.memberRole[role].startDate, 
			"endDate":req.session.memberRole[role].endDate});
	}

	//context from Member Votes
	context.memberVote = [];
	for (var vote in req.session.memberVote){
		context.memberVote.push({"congressNum":req.session.memberVote[vote].congressNum,
			"chamber":req.session.memberVote[vote].chamber,
			"sessionNum":req.session.memberVote[vote].sessionNum,
			"rollCallNum":req.session.memberVote[vote].rollCallNum,
			"billNumber":req.session.memberVote[vote].billNumber,
			"billTitle":req.session.memberVote[vote].billTitle,
			"latestAction":req.session.memberVote[vote].latestAction,
			"description":req.session.memberVote[vote].description,
			"question":req.session.memberVote[vote].question,
			"date":req.session.memberVote[vote].date,
			"time":req.session.memberVote[vote].time,
			"position":req.session.memberVote[vote].position});
	}

	//context from both Member Bio and Member Votes
	context.memberId = req.session.memberId;

	//context from Find All Members
	context.chamberName = req.session.chamberName;
	context.congressNumber = req.session.congressNumber;
	context.congressMember = [];
	for (var member in req.session.congressMember){
		context.congressMember.push({"firstName":req.session.congressMember[member].firstName,
			"lastName":req.session.congressMember[member].lastName,
			"idNum":req.session.congressMember[member].idNum,
			"party":req.session.congressMember[member].party,
			"state":req.session.congressMember[member].state,
			"district":req.session.congressMember[member].district,
			"url":req.session.congressMember[member].url});
	}

	//context from Get Voting Details
	context.rollCallCongressNum = req.session.rollCallCongressNum;
	context.rollCallChamber = req.session.rollCallChamber;
	context.rollCallSession = req.session.rollCallSession;
	context.rollCallNumber = req.session.rollCallNumber;
	context.voteQuestion = req.session.voteQuestion; 
	context.voteDescription = req.session.voteDescription; 
	context.voteDate = req.session.voteDate; 
	context.voteTime = req.session.voteTime; 
	context.voteResult = req.session.voteResult; 
	context.demYesVote = req.session.demYesVote; 
	context.demNoVote = req.session.demNoVote;
	context.demNotVoting = req.session.demNotVoting;
	context.repYesVote = req.session.repYesVote;
	context.repNoVote = req.session.repNoVote;
	context.repNotVoting = req.session.repNotVoting;
	context.indYesVote = req.session.indYesVote;
	context.indNoVote = req.session.indNoVote;
	context.indNotVoting = req.session.indNotVoting;
	context.totYesVote = req.session.totYesVote;
	context.totNoVote = req.session.totNoVote;
	context.totNotVoting = req.session.totNotVoting;

	//context from Get Bill Details
	context.billTitle = req.session.billTitle;
	context.billId = req.session.billId;
	context.billSponsor = req.session.billSponsor;
	context.billDateIntro = req.session.billDateIntro;
	context.billCommittees = req.session.billCommittees;
	context.billLatestDate = req.session.billLatestDate;
	context.billLatestAction = req.session.billLatestAction;

	//context from Get Bills by Member
	context.billMemberType = req.session.billMemberType;
	context.billMemberName = req.session.billMemberName;
	context.billMemberBill = [];
	for (var bill in req.session.billMemberBill){
		context.billMemberBill.push({"billNumber":req.session.billMemberBill[bill].billNumber,
			"billTitle":req.session.billMemberBill[bill].billTitle,
			"dateIntro":req.session.billMemberBill[bill].dateIntro,
			"cosponsors":req.session.billMemberBill[bill].cosponsors,
			"latestDate":req.session.billMemberBill[bill].latestDate,
			"latestAction":req.session.billMemberBill[bill].latestAction});
	}

	//context from Get Bills by Cosponsor
	context.cosponsorId = req.session.cosponsorId;
	context.cosponsorActionType = req.session.cosponsorActionType;
	context.cosponsorMemberName = req.session.cosponsorMemberName;
	context.cosponsorBill = [];
	for (var bill in req.session.cosponsorBill){
		context.cosponsorBill.push({"billNumber":req.session.cosponsorBill[bill].billNumber,
			"billTitle":req.session.cosponsorBill[bill].billTitle,
			"sponsorId":req.session.cosponsorBill[bill].sponsorId,
			"cosponsorDate":req.session.cosponsorBill[bill].cosponsorDate,
			"withdrawnDate":req.session.cosponsorBill[bill].withdrawnDate,
			"dateIntro":req.session.cosponsorBill[bill].dateIntro,
			"cosponsors":req.session.cosponsorBill[bill].cosponsors,
			"latestDate":req.session.cosponsorBill[bill].latestDate,
			"latestAction":req.session.cosponsorBill[bill].latestAction});
	}
	return context;
}

//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/B001278/bills/introduced.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578
//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/A000055/bills/cosponsored.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578
//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/114/senate/committees.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578
//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/senate/schedule.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578
//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/A000055/floor_appearances.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578

function getMemberBio(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/'
	requestURI += context.memberId + '.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.memberFirstName = responseData.results[0].first_name;
			req.session.memberLastName = responseData.results[0].last_name;
			req.session.memberBirthdate = responseData.results[0].date_of_birth;
			req.session.memberUrl = responseData.results[0].url;
			req.session.memberTwitter = responseData.results[0].twitter_account;
			req.session.memberRole = [];
			for (var role in responseData.results[0].roles){
				req.session.memberRole.push({"number":responseData.results[0].roles[role].congress, 
					"chamber":responseData.results[0].roles[role].chamber, 
					"title":responseData.results[0].roles[role].title,
					"state":responseData.results[0].roles[role].state, 
					"party":responseData.results[0].roles[role].party, 
					"district":responseData.results[0].roles[role].district, 
					"startDate":responseData.results[0].roles[role].start_date, 
					"endDate":responseData.results[0].roles[role].end_date});
			}
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

function getMemberVotePositions(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/'
	requestURI += context.memberId + '/votes.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.memberVote = [];
			for (var vote in responseData.results[0].votes){
				req.session.memberVote.push({"congressNum":responseData.results[0].votes[vote].congress,
					"chamber":responseData.results[0].votes[vote].chamber,
					"sessionNum":responseData.results[0].votes[vote].session,
					"rollCallNum":responseData.results[0].votes[vote].roll_call,
					"billNumber":responseData.results[0].votes[vote].bill.number,
					"billTitle":responseData.results[0].votes[vote].bill.title,
					"latestAction":responseData.results[0].votes[vote].bill.latest_action,
					"description":responseData.results[0].votes[vote].description,
					"question":responseData.results[0].votes[vote].question,
					"date":responseData.results[0].votes[vote].date,
					"time":responseData.results[0].votes[vote].time,
					"position":responseData.results[0].votes[vote].position});
			}
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

function getAllMembers(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/'
	requestURI += context.congressNumber + '/' + context.chamber + '/members.json?&api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.chamberName = responseData.results[0].chamber;
			req.session.congressNumber = responseData.results[0].congress;
			req.session.congressMember = [];
			for (var member in responseData.results[0].members){
				req.session.congressMember.push({"firstName":responseData.results[0].members[member].first_name,
					"lastName":responseData.results[0].members[member].last_name,
					"idNum":responseData.results[0].members[member].id,
					"party":responseData.results[0].members[member].party,
					"state":responseData.results[0].members[member].state,
					"district":responseData.results[0].members[member].district,
					"url":responseData.results[0].members[member].url});
			}
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

//http://api.nytimes.com/svc/politics/v3/us/legislative/congress/114/senate/sessions/1/votes/302.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578

function getRollCallVotes(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/'
	requestURI += context.rollCallCongressNum + '/' + context.rollCallChamber + '/sessions/' + context.rollCallSession + '/votes/' + context.rollCallNumber + '.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.voteQuestion = responseData.results.votes.vote.question;
			req.session.voteDescription = responseData.results.votes.vote.description;
			req.session.voteDate = responseData.results.votes.vote.date;
			req.session.voteTime = responseData.results.votes.vote.time;
			req.session.voteResult = responseData.results.votes.vote.result;
			req.session.demYesVote = responseData.results.votes.vote.democratic.yes;
			req.session.demNoVote = responseData.results.votes.vote.democratic.no;
			req.session.demNotVoting = responseData.results.votes.vote.democratic.not_voting;
			req.session.repYesVote = responseData.results.votes.vote.republican.yes;
			req.session.repNoVote = responseData.results.votes.vote.republican.no;
			req.session.repNotVoting = responseData.results.votes.vote.republican.not_voting;
			req.session.indYesVote = responseData.results.votes.vote.independent.yes;
			req.session.indNoVote = responseData.results.votes.vote.independent.no;
			req.session.indNotVoting = responseData.results.votes.vote.independent.not_voting;
			req.session.totYesVote = responseData.results.votes.vote.total.yes;
			req.session.totNoVote = responseData.results.votes.vote.total.no;
			req.session.totNotVoting = responseData.results.votes.vote.total.not_voting;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}


function getBillDetails(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/'
	requestURI += context.billCongressNum + '/bills/' + context.billId + '.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.billTitle = responseData.results[0].title;
			req.session.billId = responseData.results[0].bill;
			req.session.billSponsor = responseData.results[0].sponsor;
			req.session.billDateIntro = responseData.results[0].introduced_date;
			req.session.billCommittees = responseData.results[0].committees;
			req.session.billLatestDate = responseData.results[0].latest_major_action_date;
			req.session.billLatestAction = responseData.results[0].latest_major_action;
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

// http://api.nytimes.com/svc/politics/v3/us/legislative/congress/114/bills/HR3750.json?api-key=03c818cec948c0ff83a6f6d7483d0561:11:73739578 

function getBillsByMember(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/'
	requestURI += context.billMemberId + '/bills/' + context.billMemberType + '.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.billMemberName = responseData.results[0].name;
			req.session.billMemberBill = [];
			for (var bill in responseData.results[0].bills){
				req.session.billMemberBill.push({"billNumber":responseData.results[0].bills[bill].number,
					"billTitle":responseData.results[0].bills[bill].title,
					"dateIntro":responseData.results[0].bills[bill].introduced_date,
					"cosponsors":responseData.results[0].bills[bill].cosponsors,
					"latestDate":responseData.results[0].bills[bill].latest_major_action_date,
					"latestAction":responseData.results[0].bills[bill].latest_major_action});
			}
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

function getBillsByCosponsor(context, req, callback){
	var yourAPIKey = '03c818cec948c0ff83a6f6d7483d0561:11:73739578';
	var requestURI = 'http://api.nytimes.com/svc/politics/v3/us/legislative/congress/members/'
	requestURI += context.cosponsorId + '/bills/' + context.cosponsorActionType + '.json?api-key=' + yourAPIKey;
	request(requestURI, function(err, response, body){
		if(!err && response.statusCode < 400){
			var responseData = JSON.parse(body);
			//console.log(responseData);
			req.session.cosponsorMemberName = responseData.results[0].name;
			req.session.cosponsorBill = [];
			for (var bill in responseData.results[0].bills){
				req.session.cosponsorBill.push({"billNumber":responseData.results[0].bills[bill].number,
					"billTitle":responseData.results[0].bills[bill].title,
					"sponsorId":responseData.results[0].bills[bill].sponsor_id,
					"cosponsorDate":responseData.results[0].bills[bill].cosponsored_date,
					"withdrawnDate":responseData.results[0].bills[bill].withdrawn_date,
					"dateIntro":responseData.results[0].bills[bill].introduced_date,
					"cosponsors":responseData.results[0].bills[bill].cosponsors,
					"latestDate":responseData.results[0].bills[bill].latest_major_action_date,
					"latestAction":responseData.results[0].bills[bill].latest_major_action});
			}
		} else {
			console.log(err);
			if (response){
				console.log(response.statusCode);
			}
		}
		var newContext = buildContext(context, req);
		callback(newContext);
	});
}

app.get('/', function(req,res,next){
	var context = {};
	res.render('homeHowTo', context);
});

app.get('/gettingStarted', function(req,res,next){
	var context = {};
	res.render('gettingStarted', context);
});

app.get('/makingARequest', function(req,res,next){
	var context = {};
	res.render('makingARequest', context);
});

app.get('/puttingItTogether', function(req,res,next){
	var context = {};
	res.render('puttingItTogether', context);
});

app.get('/expandingFurther', function(req,res,next){
	var context = {};
	res.render('expandingFurther', context);
});

app.get('/about', function(req,res,next){
	var context = {};
	res.render('about', context);
});

app.get('/demo', function(req,res,next){
	var context = {};
	if (!req.session.name){
		res.render('newSession2', context);
		return;
	}

	context.name = req.session.name;
	var newContext = buildContext(context, req);
	res.render('congress', context);
});

app.post('/demo', function(req,res){
	var context = {};

	if(req.body['New Query']){
		req.session.name = req.body.name;
		context.name = req.session.name;
		res.render('congress', context);
		return;
	}

	if(!req.session.name){
		res.render('newSession2', context);
		return;
	}

	if(req.body['Find My Members']){
		req.session.state = req.body.state;
		req.session.district = req.body.district;
		context.state = req.session.state;
		context.district = req.session.district;
		getMembersByState(context, req, function(context){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Member Bio']){
		req.session.memberId = req.body.memberId;
		context.memberId = req.session.memberId;
		getMemberBio(context, req, function(context){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Member Votes']){
		req.session.memberId = req.body.memberId;
		context.memberId = req.session.memberId;
		getMemberVotePositions(context, req, function(context){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Find All Members']){
		req.session.congressNumber = req.body.congressNumber;
		req.session.chamber = req.body.chamber;
		context.congressNumber = req.session.congressNumber;
		context.chamber = req.session.chamber;
		getAllMembers(context, req, function(context){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Get Voting Details']){
		req.session.rollCallCongressNum = req.body.rollCallCongressNum;
		req.session.rollCallChamber = req.body.rollCallChamber;
		req.session.rollCallSession = req.body.rollCallSession;
		req.session.rollCallNumber = req.body.rollCallNumber;
		context.rollCallCongressNum = req.session.rollCallCongressNum;
		context.rollCallChamber = req.session.rollCallChamber;
		context.rollCallSession = req.session.rollCallSession;
		context.rollCallNumber = req.session.rollCallNumber;
		getRollCallVotes(context, req, function(context){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Get Bill Details']){
		req.session.billCongressNum = req.body.billCongressNum;
		req.session.billId = req.body.billId;
		context.billCongressNum = req.session.billCongressNum;
		context.billId = req.session.billId;
		getBillDetails(context, req, function(){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Get Bills by Member']){
		req.session.billMemberId = req.body.billMemberId;
		req.session.billMemberType = req.body.billMemberType;
		context.billMemberId = req.session.billMemberId;
		context.billMemberType = req.session.billMemberType;
		getBillsByMember(context, req, function(){
			res.render('congress', context);
		});
		return;
	}

	if(req.body['Get Bills by Cosponsor']){
		req.session.cosponsorId = req.body.cosponsorId;
		req.session.cosponsorActionType = req.body.cosponsorActionType;
		context.cosponsorId = req.session.cosponsorId;
		context.cosponsorActionType = req.session.cosponsorActionType;
		getBillsByCosponsor(context, req, function(){
			res.render('congress', context);
		});
		return;
	}
});


app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http:localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});