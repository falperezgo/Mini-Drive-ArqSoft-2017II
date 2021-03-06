class HashController < ApplicationController

	@@emailid = ""
	before_action :authenticate
	before_action :isOwner, only: [:deleteHash]

	#this method is call in files_controller by sendFile with name postHash(nombre)

	#def postHash
		#@path = params[:path]
		#options = {
			#:body => {
				#:path => $email
			#}.to_json,
			#:headers => {
				#'Content-Type' => 'application/json'
			#}

		#}
		#results = HTTParty.post(BASE_IP + ":3003/hashdocuments", options)
		#render json: results.code

	#end

	def getHash
		results = HTTParty.get(BASE_IP + ":3003/hashdocuments").parsed_response
		#return results
		render json: results
	end

	def getHashId
		idHash = params[:hash].to_s
		results = HTTParty.get(BASE_IP + ":3003/hashdocuments/" + idHash.to_s).parsed_response
		#return results
		render json: results
	end

	def getHashByPath
		fileName = params[:fileName].to_s + ".pdf"
		path = @@emailid + "/" + fileName
		#render json: path.to_json
		results = HTTParty.get(BASE_IP + ":3003/hashdocuments/getByPath/?path=" + path).parsed_response
		#return results
		render json: results
	end

	def putHash
		idHash = params[:hash].to_s
		@path = params[:path].to_s
		options = {
			:body => {
				:path => @path
			}.to_json,
			:headers => {
				'Content-Type' => 'application/json'
			}
		}	
		results = HTTParty.put(BASE_IP + ":3003/hashdocuments/" + idHash.to_s, options).parsed_response
		#return results
		#render json: results
	end

	def deleteHash
		idHash = params[:hash].to_s
		#render json: idHash.to_json
		results = HTTParty.delete(BASE_IP + ":3003/hashdocuments/" + idHash.to_s).parsed_response
		#return results
		render json: {"status" => 200}, status: 200
	end
	
end

