class HashdocumentsController < ApplicationController
  before_action :set_hashdocument, only: [:show, :update, :destroy]

  # GET /hashdocuments
  def index
    @hashdocuments = Hashdocument.all

    render json: @hashdocuments
  end

  # GET /hashdocuments/1
  def show
    render json: @hashdocument
  end

  # POST /hashdocuments
  def create
    @hashdocument = Hashdocument.new(hashdocument_params)

    if @hashdocument.valid?
      if @hashdocument.save
        render json: @hashdocument, status: :created, location: @hashdocument
      else
        render json: @hashdocument.errors, status: :unprocessable_entity
      end
    else
      return render json: {"status" => 410, "message" => "path invalido.", "bad request" => @hashdocument.errors[:path]}, status: :unprocessable_entity
    end


  end

  # PATCH/PUT /hashdocuments/1
  def update
    if @hashdocument.update(hashdocument_params)
      render json: @hashdocument
    else
      render json: @hashdocument.errors, status: :unprocessable_entity
    end
  end

  # DELETE /hashdocuments/1
  def destroy
    @hashdocument.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hashdocument
      @hashdocument = Hashdocument.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def hashdocument_params
      params.require(:hashdocument).permit(:path)
    end
end
